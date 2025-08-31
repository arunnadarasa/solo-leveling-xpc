import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CanvasPatient {
  id: string;
  name: Array<{
    given: string[];
    family: string;
  }>;
  birthDate: string;
  gender: string;
  telecom?: Array<{
    system: string;
    value: string;
  }>;
  address?: Array<{
    line: string[];
    city: string;
    state: string;
    postalCode: string;
  }>;
  identifier: Array<{
    type: {
      coding: Array<{
        system: string;
        code: string;
      }>;
    };
    value: string;
  }>;
}

interface CanvasCondition {
  id: string;
  subject: {
    reference: string;
  };
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  onsetDateTime?: string;
  clinicalStatus: {
    coding: Array<{
      code: string;
    }>;
  };
}

interface CanvasObservation {
  id: string;
  subject: {
    reference: string;
  };
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  valueQuantity?: {
    value: number;
    unit: string;
  };
  component?: Array<{
    code: {
      coding: Array<{
        code: string;
      }>;
    };
    valueQuantity: {
      value: number;
      unit: string;
    };
  }>;
  effectiveDateTime: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { accessToken } = await req.json();
    
    if (!accessToken) {
      throw new Error('Access token required');
    }

    console.log('Starting Canvas data sync...');

    // Fetch patients from Canvas FHIR API
    const patientsResponse = await fetch('https://secure.canvasmedical.com/api/fhir/Patient', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/fhir+json',
      },
    });

    if (!patientsResponse.ok) {
      throw new Error(`Failed to fetch patients: ${patientsResponse.status}`);
    }

    const patientsBundle = await patientsResponse.json();
    console.log(`Found ${patientsBundle.entry?.length || 0} patients`);

    const syncedPatients = [];

    for (const entry of patientsBundle.entry || []) {
      const patient: CanvasPatient = entry.resource;
      
      // Calculate age from birth date
      const birthDate = new Date(patient.birthDate);
      const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      
      // Extract MRN
      const mrnIdentifier = patient.identifier.find(id => 
        id.type?.coding?.some(c => c.code === 'MR')
      );
      const mrn = mrnIdentifier?.value || `CANVAS-${patient.id}`;
      
      // Extract contact info
      const phoneContact = patient.telecom?.find(t => t.system === 'phone');
      const emailContact = patient.telecom?.find(t => t.system === 'email');
      
      // Extract address
      const address = patient.address?.[0];
      const addressObj = address ? {
        line: address.line,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode
      } : null;

      // Insert/update patient in Supabase
      const { data: patientData, error: patientError } = await supabaseClient
        .from('patients')
        .upsert({
          id: patient.id,
          name: `${patient.name[0].given.join(' ')} ${patient.name[0].family}`,
          mrn: mrn,
          age: age,
          date_of_birth: patient.birthDate,
          gender: patient.gender,
          phone: phoneContact?.value,
          email: emailContact?.value,
          address: addressObj,
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (patientError) {
        console.error('Error syncing patient:', patientError);
        continue;
      }

      // Fetch conditions for this patient
      const conditionsResponse = await fetch(`https://secure.canvasmedical.com/api/fhir/Condition?patient=${patient.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/fhir+json',
        },
      });

      if (conditionsResponse.ok) {
        const conditionsBundle = await conditionsResponse.json();
        
        for (const conditionEntry of conditionsBundle.entry || []) {
          const condition: CanvasCondition = conditionEntry.resource;
          
          const { error: conditionError } = await supabaseClient
            .from('patient_conditions')
            .upsert({
              id: condition.id,
              patient_id: patient.id,
              condition_name: condition.code.coding[0]?.display || 'Unknown condition',
              icd_code: condition.code.coding.find(c => c.system?.includes('icd'))?.code,
              onset_date: condition.onsetDateTime ? new Date(condition.onsetDateTime).toISOString().split('T')[0] : null,
              status: condition.clinicalStatus.coding[0]?.code === 'active' ? 'active' : 'inactive',
            }, {
              onConflict: 'id'
            });

          if (conditionError) {
            console.error('Error syncing condition:', conditionError);
          }
        }
      }

      // Fetch vital signs observations
      const vitalsResponse = await fetch(`https://secure.canvasmedical.com/api/fhir/Observation?patient=${patient.id}&category=vital-signs`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/fhir+json',
        },
      });

      if (vitalsResponse.ok) {
        const vitalsBundle = await vitalsResponse.json();
        
        // Group vitals by date to create comprehensive vital records
        const vitalsByDate: { [date: string]: any } = {};
        
        for (const vitalEntry of vitalsBundle.entry || []) {
          const vital: CanvasObservation = vitalEntry.resource;
          const date = vital.effectiveDateTime.split('T')[0];
          
          if (!vitalsByDate[date]) {
            vitalsByDate[date] = {
              patient_id: patient.id,
              recorded_at: vital.effectiveDateTime,
            };
          }
          
          // Map LOINC codes to our schema
          const loincCode = vital.code.coding.find(c => c.system?.includes('loinc'))?.code;
          
          switch (loincCode) {
            case '8480-6': // Systolic BP
              vitalsByDate[date].blood_pressure_systolic = vital.valueQuantity?.value;
              break;
            case '8462-4': // Diastolic BP
              vitalsByDate[date].blood_pressure_diastolic = vital.valueQuantity?.value;
              break;
            case '8867-4': // Heart rate
              vitalsByDate[date].heart_rate = vital.valueQuantity?.value;
              break;
            case '8310-5': // Body temperature
              vitalsByDate[date].temperature = vital.valueQuantity?.value;
              break;
            case '2708-6': // Oxygen saturation
              vitalsByDate[date].oxygen_saturation = vital.valueQuantity?.value;
              break;
            case '29463-7': // Body weight
              vitalsByDate[date].weight = vital.valueQuantity?.value;
              break;
            case '8302-2': // Body height
              vitalsByDate[date].height = vital.valueQuantity?.value;
              break;
            case '85354-9': // Blood pressure (both systolic and diastolic)
              if (vital.component) {
                for (const component of vital.component) {
                  const componentCode = component.code.coding[0]?.code;
                  if (componentCode === '8480-6') {
                    vitalsByDate[date].blood_pressure_systolic = component.valueQuantity.value;
                  } else if (componentCode === '8462-4') {
                    vitalsByDate[date].blood_pressure_diastolic = component.valueQuantity.value;
                  }
                }
              }
              break;
          }
        }
        
        // Insert vital records
        for (const vitals of Object.values(vitalsByDate)) {
          // Calculate BMI if height and weight are available
          if (vitals.height && vitals.weight) {
            const heightInMeters = vitals.height / 100; // Convert cm to meters
            vitals.bmi = vitals.weight / (heightInMeters * heightInMeters);
          }
          
          const { error: vitalsError } = await supabaseClient
            .from('patient_vitals')
            .insert(vitals);

          if (vitalsError) {
            console.error('Error syncing vitals:', vitalsError);
          }
        }
      }

      syncedPatients.push({
        id: patient.id,
        name: patientData.name,
        mrn: patientData.mrn
      });
    }

    console.log(`Successfully synced ${syncedPatients.length} patients from Canvas`);

    return new Response(
      JSON.stringify({ 
        success: true,
        syncedPatients,
        message: `Successfully synced ${syncedPatients.length} patients from Canvas EHR`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in canvas-sync:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});