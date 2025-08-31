-- Create patients table for clinical decision support
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mrn TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  phone TEXT,
  email TEXT,
  address JSONB,
  emergency_contact JSONB,
  insurance_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk_assessments table
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  overall_risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  risk_factors JSONB NOT NULL DEFAULT '[]',
  phenoml_analysis JSONB,
  metriport_data JSONB,
  ai_recommendations JSONB DEFAULT '[]',
  assessment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clinical_alerts table
CREATE TABLE public.clinical_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('critical', 'warning', 'info')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommended_action TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient_conditions table
CREATE TABLE public.patient_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  condition_name TEXT NOT NULL,
  icd_code TEXT,
  onset_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'inactive')),
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient_vitals table
CREATE TABLE public.patient_vitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  temperature DECIMAL(4,1),
  oxygen_saturation INTEGER,
  weight DECIMAL(5,1),
  height INTEGER,
  bmi DECIMAL(4,1),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  recorded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create care_team_actions table
CREATE TABLE public.care_team_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  action_description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_to TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_team_actions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for hackathon demo purposes)
CREATE POLICY "Anyone can view patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Anyone can create patients" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update patients" ON public.patients FOR UPDATE USING (true);

CREATE POLICY "Anyone can view risk assessments" ON public.risk_assessments FOR SELECT USING (true);
CREATE POLICY "Anyone can create risk assessments" ON public.risk_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update risk assessments" ON public.risk_assessments FOR UPDATE USING (true);

CREATE POLICY "Anyone can view alerts" ON public.clinical_alerts FOR SELECT USING (true);
CREATE POLICY "Anyone can create alerts" ON public.clinical_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update alerts" ON public.clinical_alerts FOR UPDATE USING (true);

CREATE POLICY "Anyone can view conditions" ON public.patient_conditions FOR SELECT USING (true);
CREATE POLICY "Anyone can create conditions" ON public.patient_conditions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update conditions" ON public.patient_conditions FOR UPDATE USING (true);

CREATE POLICY "Anyone can view vitals" ON public.patient_vitals FOR SELECT USING (true);
CREATE POLICY "Anyone can create vitals" ON public.patient_vitals FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update vitals" ON public.patient_vitals FOR UPDATE USING (true);

CREATE POLICY "Anyone can view care actions" ON public.care_team_actions FOR SELECT USING (true);
CREATE POLICY "Anyone can create care actions" ON public.care_team_actions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update care actions" ON public.care_team_actions FOR UPDATE USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_risk_assessments_updated_at
  BEFORE UPDATE ON public.risk_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clinical_alerts_updated_at
  BEFORE UPDATE ON public.clinical_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_conditions_updated_at
  BEFORE UPDATE ON public.patient_conditions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_care_team_actions_updated_at
  BEFORE UPDATE ON public.care_team_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_patients_mrn ON public.patients(mrn);
CREATE INDEX idx_risk_assessments_patient_id ON public.risk_assessments(patient_id);
CREATE INDEX idx_risk_assessments_risk_level ON public.risk_assessments(risk_level);
CREATE INDEX idx_clinical_alerts_patient_id ON public.clinical_alerts(patient_id);
CREATE INDEX idx_clinical_alerts_active ON public.clinical_alerts(is_active);
CREATE INDEX idx_patient_conditions_patient_id ON public.patient_conditions(patient_id);
CREATE INDEX idx_patient_vitals_patient_id ON public.patient_vitals(patient_id);
CREATE INDEX idx_care_team_actions_patient_id ON public.care_team_actions(patient_id);
CREATE INDEX idx_care_team_actions_status ON public.care_team_actions(status);