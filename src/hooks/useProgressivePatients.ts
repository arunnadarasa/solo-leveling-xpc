import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/components/dashboard/PatientDashboard';

interface ProgressiveLoadingState {
  patients: Patient[];
  loading: {
    basic: boolean;
    details: boolean;
    ai: boolean;
  };
  error: string | null;
}

export const useProgressivePatients = () => {
  const [state, setState] = useState<ProgressiveLoadingState>({
    patients: [],
    loading: {
      basic: true,
      details: false,
      ai: false
    },
    error: null
  });

  // Fetch basic patient data first (fast)
  const fetchBasicPatients = async () => {
    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, basic: true }, error: null }));
      
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('id, name, age, mrn, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (patientsError) throw patientsError;

      // Create basic patient objects with placeholder data
      const basicPatients: Patient[] = (patientsData || []).map((patient: any) => ({
        id: patient.id,
        name: patient.name,
        age: patient.age,
        mrn: patient.mrn,
        riskScore: 0, // Will be loaded later
        riskLevel: 'low' as const,
        conditions: [],
        lastVisit: patient.updated_at.split('T')[0],
        alerts: 0,
        riskAssessments: []
      }));

      setState(prev => ({
        ...prev,
        patients: basicPatients,
        loading: { ...prev.loading, basic: false, details: true }
      }));

      // Immediately start loading details
      await fetchPatientDetails(basicPatients);
      
    } catch (err) {
      console.error('Error fetching basic patients:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch patients',
        loading: { basic: false, details: false, ai: false }
      }));
    }
  };

  // Fetch detailed data for each patient (background)
  const fetchPatientDetails = async (basicPatients: Patient[]) => {
    try {
      const patientIds = basicPatients.map(p => p.id);
      
      // Fetch all related data in parallel - prioritize risk assessments with AI data
      const [riskAssessments, clinicalAlerts, conditions, vitals] = await Promise.all([
        supabase.from('risk_assessments')
          .select('*')
          .in('patient_id', patientIds)
          .order('assessment_date', { ascending: false }),
        supabase.from('clinical_alerts').select('*').in('patient_id', patientIds).eq('is_active', true),
        supabase.from('patient_conditions').select('*').in('patient_id', patientIds),
        supabase.from('patient_vitals').select('*').in('patient_id', patientIds).order('recorded_at', { ascending: false })
      ]);

      // Group data by patient ID for efficient lookup
      const riskByPatient = new Map();
      const alertsByPatient = new Map();
      const conditionsByPatient = new Map();
      const vitalsByPatient = new Map();

      riskAssessments.data?.forEach(risk => {
        if (!riskByPatient.has(risk.patient_id)) riskByPatient.set(risk.patient_id, []);
        riskByPatient.get(risk.patient_id).push(risk);
      });

      clinicalAlerts.data?.forEach(alert => {
        if (!alertsByPatient.has(alert.patient_id)) alertsByPatient.set(alert.patient_id, []);
        alertsByPatient.get(alert.patient_id).push(alert);
      });

      conditions.data?.forEach(condition => {
        if (!conditionsByPatient.has(condition.patient_id)) conditionsByPatient.set(condition.patient_id, []);
        conditionsByPatient.get(condition.patient_id).push(condition);
      });

      vitals.data?.forEach(vital => {
        if (!vitalsByPatient.has(vital.patient_id)) vitalsByPatient.set(vital.patient_id, []);
        vitalsByPatient.get(vital.patient_id).push(vital);
      });

      // Update patients with detailed data
      const detailedPatients: Patient[] = basicPatients.map(patient => {
        const patientRisks = riskByPatient.get(patient.id) || [];
        const patientAlerts = alertsByPatient.get(patient.id) || [];
        const patientConditions = conditionsByPatient.get(patient.id) || [];
        const patientVitals = vitalsByPatient.get(patient.id) || [];

        // Prioritize risk assessment with AI consultation data
        const latestRiskAssessment = patientRisks.find(risk => risk.ai_consultation) || patientRisks[0];
        const latestVitals = patientVitals[0];

        return {
          ...patient,
          riskScore: latestRiskAssessment?.overall_risk_score || 0,
          riskLevel: latestRiskAssessment?.risk_level || 'low',
          chartQualityScore: latestRiskAssessment?.chart_quality_score,
          chartReviewDomains: latestRiskAssessment?.chart_review_domains,
          conditions: patientConditions.map((c: any) => c.condition_name),
          alerts: patientAlerts.length,
          riskAssessments: patientRisks,
          vitals: latestVitals ? {
            bloodPressure: `${latestVitals.blood_pressure_systolic || 0}/${latestVitals.blood_pressure_diastolic || 0}`,
            heartRate: latestVitals.heart_rate || 0,
            temperature: latestVitals.temperature || 0,
            oxygenSat: latestVitals.oxygen_saturation || 0
          } : undefined
        };
      });

      setState(prev => ({
        ...prev,
        patients: detailedPatients,
        loading: { ...prev.loading, details: false, ai: true }
      }));

      // Start AI consultation generation in background (non-blocking)
      generateAIConsultationsBackground(detailedPatients);

    } catch (err) {
      console.error('Error fetching patient details:', err);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, details: false, ai: false }
      }));
    }
  };

  // Generate AI consultations in background (non-blocking)
  const generateAIConsultationsBackground = async (patients: Patient[]) => {
    try {
      const patientsNeedingConsultation = patients.filter(patient => {
        const latestAssessment = patient.riskAssessments?.[0];
        if (!latestAssessment?.ai_consultation) return true;
        
        // Check if consultation is older than 24 hours
        const assessmentDate = new Date(latestAssessment.assessment_date);
        const now = new Date();
        const hoursSinceAssessment = (now.getTime() - assessmentDate.getTime()) / (1000 * 60 * 60);
        
        return hoursSinceAssessment > 24;
      });

      // Generate AI consultations in parallel (limit to 3 concurrent)
      const concurrentLimit = 3;
      const chunks = [];
      for (let i = 0; i < patientsNeedingConsultation.length; i += concurrentLimit) {
        chunks.push(patientsNeedingConsultation.slice(i, i + concurrentLimit));
      }

      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(async (patient) => {
            try {
              console.log(`Background AI consultation for: ${patient.name}`);
              await supabase.functions.invoke('clinical-ai-analysis', {
                body: { patientId: patient.id, type: 'keywell' }
              });
            } catch (error) {
              console.error(`AI consultation failed for ${patient.id}:`, error);
            }
          })
        );
      }

      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, ai: false }
      }));

    } catch (err) {
      console.error('Error generating AI consultations:', err);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, ai: false }
      }));
    }
  };

  const seedDemoData = async () => {
    try {
      // Check if we already have patients
      const { data: existingPatients } = await supabase
        .from('patients')
        .select('id')
        .limit(1);

      if (existingPatients && existingPatients.length > 0) {
        return; // Already seeded
      }

      // Seed demo patients (same as before, but more efficient)
      const demoPatients = [
        {
          mrn: 'MRN001234',
          name: 'Sarah Johnson',
          age: 67,
          date_of_birth: '1956-05-15',
          gender: 'female',
          phone: '+1-555-0123',
          email: 'sarah.johnson@email.com'
        },
        {
          mrn: 'MRN001235',
          name: 'Michael Chen',
          age: 45,
          date_of_birth: '1978-11-22',
          gender: 'male',
          phone: '+1-555-0124',
          email: 'michael.chen@email.com'
        },
        {
          mrn: 'MRN001236',
          name: 'Emily Rodriguez',
          age: 32,
          date_of_birth: '1991-03-08',
          gender: 'female',
          phone: '+1-555-0125',
          email: 'emily.rodriguez@email.com'
        }
      ];

      const { data: insertedPatients, error: insertError } = await supabase
        .from('patients')
        .insert(demoPatients)
        .select();

      if (insertError) throw insertError;

      if (insertedPatients) {
        // Insert all related data in parallel for better performance
        const conditions = [
          { patient_id: insertedPatients[0].id, condition_name: 'Diabetes Type 2', icd_code: 'E11', status: 'active', severity: 'moderate' },
          { patient_id: insertedPatients[0].id, condition_name: 'Hypertension', icd_code: 'I10', status: 'active', severity: 'moderate' },
          { patient_id: insertedPatients[0].id, condition_name: 'Coronary Artery Disease', icd_code: 'I25', status: 'active', severity: 'severe' },
          { patient_id: insertedPatients[1].id, condition_name: 'Obesity', icd_code: 'E66', status: 'active', severity: 'moderate' },
          { patient_id: insertedPatients[1].id, condition_name: 'Pre-diabetes', icd_code: 'R73', status: 'active', severity: 'mild' },
          { patient_id: insertedPatients[2].id, condition_name: 'Asthma', icd_code: 'J45', status: 'active', severity: 'mild' }
        ];

        const vitals = [
          {
            patient_id: insertedPatients[0].id,
            blood_pressure_systolic: 165,
            blood_pressure_diastolic: 95,
            heart_rate: 92,
            temperature: 98.6,
            oxygen_saturation: 96,
            recorded_by: 'Dr. Smith'
          },
          {
            patient_id: insertedPatients[1].id,
            blood_pressure_systolic: 140,
            blood_pressure_diastolic: 85,
            heart_rate: 78,
            temperature: 98.4,
            oxygen_saturation: 98,
            recorded_by: 'Nurse Johnson'
          },
          {
            patient_id: insertedPatients[2].id,
            blood_pressure_systolic: 125,
            blood_pressure_diastolic: 80,
            heart_rate: 72,
            temperature: 98.2,
            oxygen_saturation: 99,
            recorded_by: 'Dr. Wilson'
          }
        ];

        const riskAssessments = [
          {
            patient_id: insertedPatients[0].id,
            overall_risk_score: 85,
            risk_level: 'critical',
            risk_factors: [
              { name: 'Cardiovascular Risk', score: 85, trend: 'up' },
              { name: 'Diabetes Progression', score: 72, trend: 'stable' }
            ],
            ai_recommendations: [
              'Immediate cardiology consultation recommended',
              'Adjust BP medication dosage',
              'Schedule diabetes educator appointment'
            ]
          },
          {
            patient_id: insertedPatients[1].id,
            overall_risk_score: 65,
            risk_level: 'high',
            risk_factors: [
              { name: 'Metabolic Risk', score: 65, trend: 'up' },
              { name: 'Lifestyle Factors', score: 58, trend: 'stable' }
            ],
            ai_recommendations: [
              'Weight management program enrollment',
              'Nutritionist consultation',
              'Exercise plan development'
            ]
          },
          {
            patient_id: insertedPatients[2].id,
            overall_risk_score: 35,
            risk_level: 'medium',
            risk_factors: [
              { name: 'Respiratory Risk', score: 35, trend: 'stable' }
            ],
            ai_recommendations: [
              'Continue current asthma management',
              'Monitor seasonal triggers'
            ]
          }
        ];

        const alerts = [
          {
            patient_id: insertedPatients[0].id,
            alert_type: 'critical',
            title: 'BP Crisis Risk',
            description: 'Blood pressure readings indicate potential hypertensive crisis',
            recommended_action: 'Schedule immediate follow-up',
            is_active: true
          },
          {
            patient_id: insertedPatients[0].id,
            alert_type: 'warning',
            title: 'Medication Gap',
            description: 'Patient missed last 2 metformin doses',
            recommended_action: 'Contact patient for adherence check',
            is_active: true
          },
          {
            patient_id: insertedPatients[0].id,
            alert_type: 'info',
            title: 'Lab Results Ready',
            description: 'HbA1c and lipid panel results available for review',
            recommended_action: 'Review and discuss with patient',
            is_active: true
          },
          {
            patient_id: insertedPatients[1].id,
            alert_type: 'warning',
            title: 'Weight Trend',
            description: 'BMI has increased 5% over last 6 months',
            recommended_action: 'Discuss weight management strategies',
            is_active: true
          }
        ];

        // Insert all data in parallel
        await Promise.all([
          supabase.from('patient_conditions').insert(conditions),
          supabase.from('patient_vitals').insert(vitals),
          supabase.from('risk_assessments').insert(riskAssessments),
          supabase.from('clinical_alerts').insert(alerts)
        ]);
      }

      console.log('Demo data seeded successfully');
    } catch (err) {
      console.error('Error seeding demo data:', err);
    }
  };

  const refetch = useCallback(async () => {
    await fetchBasicPatients();
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      await seedDemoData();
      await fetchBasicPatients();
    };

    initializeData();
  }, []);

  return {
    patients: state.patients,
    loading: state.loading.basic, // Main loading state for backward compatibility
    loadingStates: state.loading, // Detailed loading states
    error: state.error,
    refetch
  };
};