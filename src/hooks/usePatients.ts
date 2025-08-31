import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/components/dashboard/PatientDashboard';

export interface DbPatient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  date_of_birth: string | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbRiskAssessment {
  id: string;
  patient_id: string;
  overall_risk_score: number;
  risk_level: string;
  risk_factors: any[];
  phenoml_analysis: any;
  metriport_data: any;
  ai_recommendations: any[];
  assessment_date: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface DbClinicalAlert {
  id: string;
  patient_id: string;
  alert_type: string;
  title: string;
  description: string;
  recommended_action: string | null;
  is_active: boolean;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbPatientCondition {
  id: string;
  patient_id: string;
  condition_name: string;
  icd_code: string | null;
  onset_date: string | null;
  status: string;
  severity: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbPatientVitals {
  id: string;
  patient_id: string;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  heart_rate: number | null;
  temperature: number | null;
  oxygen_saturation: number | null;
  weight: number | null;
  height: number | null;
  bmi: number | null;
  recorded_at: string;
  recorded_by: string | null;
  created_at: string;
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      // Fetch patients with related data
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select(`
          *,
          risk_assessments(*),
          clinical_alerts(*),
          patient_conditions(*),
          patient_vitals(*)
        `)
        .order('created_at', { ascending: false });

      if (patientsError) {
        throw patientsError;
      }

      const formattedPatients: Patient[] = (patientsData || []).map((patient: any) => {
        const latestRiskAssessment = patient.risk_assessments?.[0];
        const activeAlerts = patient.clinical_alerts?.filter((alert: any) => alert.is_active) || [];
        const latestVitals = patient.patient_vitals?.[0];
        
        return {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          mrn: patient.mrn,
          riskScore: latestRiskAssessment?.overall_risk_score || 0,
          riskLevel: latestRiskAssessment?.risk_level || 'low',
          conditions: patient.patient_conditions?.map((c: any) => c.condition_name) || [],
          lastVisit: patient.updated_at.split('T')[0],
          alerts: activeAlerts.length,
          vitals: latestVitals ? {
            bloodPressure: `${latestVitals.blood_pressure_systolic || 0}/${latestVitals.blood_pressure_diastolic || 0}`,
            heartRate: latestVitals.heart_rate || 0,
            temperature: latestVitals.temperature || 0,
            oxygenSat: latestVitals.oxygen_saturation || 0
          } : undefined
        };
      });

      setPatients(formattedPatients);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    } finally {
      setLoading(false);
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

      // Seed demo patients
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
        // Add conditions
        const conditions = [
          { patient_id: insertedPatients[0].id, condition_name: 'Diabetes Type 2', icd_code: 'E11', status: 'active', severity: 'moderate' },
          { patient_id: insertedPatients[0].id, condition_name: 'Hypertension', icd_code: 'I10', status: 'active', severity: 'moderate' },
          { patient_id: insertedPatients[0].id, condition_name: 'Coronary Artery Disease', icd_code: 'I25', status: 'active', severity: 'severe' },
          { patient_id: insertedPatients[1].id, condition_name: 'Obesity', icd_code: 'E66', status: 'active', severity: 'moderate' },
          { patient_id: insertedPatients[1].id, condition_name: 'Pre-diabetes', icd_code: 'R73', status: 'active', severity: 'mild' },
          { patient_id: insertedPatients[2].id, condition_name: 'Asthma', icd_code: 'J45', status: 'active', severity: 'mild' }
        ];

        await supabase.from('patient_conditions').insert(conditions);

        // Add vitals
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

        await supabase.from('patient_vitals').insert(vitals);

        // Add risk assessments
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

        await supabase.from('risk_assessments').insert(riskAssessments);

        // Add clinical alerts
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

        await supabase.from('clinical_alerts').insert(alerts);
      }

      console.log('Demo data seeded successfully');
    } catch (err) {
      console.error('Error seeding demo data:', err);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await seedDemoData();
      await fetchPatients();
    };

    initializeData();
  }, []);

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients
  };
};