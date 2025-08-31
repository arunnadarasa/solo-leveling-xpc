-- CRITICAL SECURITY FIX: Lock down all medical data tables
-- Create healthcare provider roles and access control system

-- Create healthcare provider profiles table
CREATE TABLE public.healthcare_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  license_number TEXT,
  provider_type TEXT NOT NULL, -- 'doctor', 'nurse', 'admin', 'auditor'
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on healthcare_providers
ALTER TABLE public.healthcare_providers ENABLE ROW LEVEL SECURITY;

-- Create patient-provider assignments table
CREATE TABLE public.patient_provider_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.healthcare_providers(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES public.healthcare_providers(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(patient_id, provider_id)
);

-- Enable RLS on patient_provider_assignments
ALTER TABLE public.patient_provider_assignments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check patient access
CREATE OR REPLACE FUNCTION public.has_patient_access(user_uuid UUID, patient_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.healthcare_providers hp
    JOIN public.patient_provider_assignments ppa ON hp.id = ppa.provider_id
    WHERE hp.user_id = user_uuid 
    AND ppa.patient_id = patient_uuid 
    AND hp.is_active = true 
    AND ppa.is_active = true
  ) OR EXISTS (
    SELECT 1 
    FROM public.healthcare_providers hp
    WHERE hp.user_id = user_uuid 
    AND hp.provider_type = 'admin'
    AND hp.is_active = true
  );
$$;

-- Create audit log table for PHI access
CREATE TABLE public.phi_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL, -- 'SELECT', 'INSERT', 'UPDATE', 'DELETE'
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS on phi_access_logs
ALTER TABLE public.phi_access_logs ENABLE ROW LEVEL SECURITY;

-- **CRITICAL: DROP ALL EXISTING PERMISSIVE RLS POLICIES**

-- Drop existing policies on patients table
DROP POLICY IF EXISTS "Anyone can view patients" ON public.patients;
DROP POLICY IF EXISTS "Anyone can create patients" ON public.patients;  
DROP POLICY IF EXISTS "Anyone can update patients" ON public.patients;

-- Drop existing policies on patient_conditions table
DROP POLICY IF EXISTS "Anyone can view conditions" ON public.patient_conditions;
DROP POLICY IF EXISTS "Anyone can create conditions" ON public.patient_conditions;
DROP POLICY IF EXISTS "Anyone can update conditions" ON public.patient_conditions;

-- Drop existing policies on patient_vitals table
DROP POLICY IF EXISTS "Anyone can view vitals" ON public.patient_vitals;
DROP POLICY IF EXISTS "Anyone can create vitals" ON public.patient_vitals;
DROP POLICY IF EXISTS "Anyone can update vitals" ON public.patient_vitals;

-- Drop existing policies on clinical_alerts table
DROP POLICY IF EXISTS "Anyone can view alerts" ON public.clinical_alerts;
DROP POLICY IF EXISTS "Anyone can create alerts" ON public.clinical_alerts;
DROP POLICY IF EXISTS "Anyone can update alerts" ON public.clinical_alerts;

-- Drop existing policies on risk_assessments table
DROP POLICY IF EXISTS "Anyone can view risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Anyone can create risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Anyone can update risk assessments" ON public.risk_assessments;

-- Drop existing policies on care_team_actions table
DROP POLICY IF EXISTS "Anyone can view care actions" ON public.care_team_actions;
DROP POLICY IF EXISTS "Anyone can create care actions" ON public.care_team_actions;
DROP POLICY IF EXISTS "Anyone can update care actions" ON public.care_team_actions;

-- **CREATE SECURE RLS POLICIES REQUIRING AUTHENTICATION AND PATIENT ACCESS**

-- Secure policies for patients table
CREATE POLICY "Authenticated providers can view assigned patients" 
ON public.patients FOR SELECT 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), id));

CREATE POLICY "Authenticated providers can create patients" 
ON public.patients FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated providers can update assigned patients" 
ON public.patients FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), id));

-- Secure policies for patient_conditions table
CREATE POLICY "Authenticated providers can view patient conditions" 
ON public.patient_conditions FOR SELECT 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

CREATE POLICY "Authenticated providers can create patient conditions" 
ON public.patient_conditions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

CREATE POLICY "Authenticated providers can update patient conditions" 
ON public.patient_conditions FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

-- Secure policies for patient_vitals table
CREATE POLICY "Authenticated providers can view patient vitals" 
ON public.patient_vitals FOR SELECT 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

CREATE POLICY "Authenticated providers can create patient vitals" 
ON public.patient_vitals FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

CREATE POLICY "Authenticated providers can update patient vitals" 
ON public.patient_vitals FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

-- Secure policies for clinical_alerts table
CREATE POLICY "Authenticated providers can view patient alerts" 
ON public.clinical_alerts FOR SELECT 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

CREATE POLICY "Authenticated providers can create patient alerts" 
ON public.clinical_alerts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

CREATE POLICY "Authenticated providers can update patient alerts" 
ON public.clinical_alerts FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

-- Secure policies for risk_assessments table
CREATE POLICY "Authenticated providers can view patient risk assessments" 
ON public.risk_assessments FOR SELECT 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

CREATE POLICY "Authenticated providers can create patient risk assessments" 
ON public.risk_assessments FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

CREATE POLICY "Authenticated providers can update patient risk assessments" 
ON public.risk_assessments FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

-- Secure policies for care_team_actions table
CREATE POLICY "Authenticated providers can view patient care actions" 
ON public.care_team_actions FOR SELECT 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

CREATE POLICY "Authenticated providers can create patient care actions" 
ON public.care_team_actions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

CREATE POLICY "Authenticated providers can update patient care actions" 
ON public.care_team_actions FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL AND public.has_patient_access(auth.uid(), patient_id));

-- Secure policies for healthcare_providers table
CREATE POLICY "Providers can view their own profile" 
ON public.healthcare_providers FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all provider profiles" 
ON public.healthcare_providers FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.healthcare_providers 
    WHERE user_id = auth.uid() AND provider_type = 'admin' AND is_active = true
  )
);

CREATE POLICY "Providers can update their own profile" 
ON public.healthcare_providers FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Secure policies for patient_provider_assignments table
CREATE POLICY "Providers can view their patient assignments" 
ON public.patient_provider_assignments FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.healthcare_providers 
    WHERE user_id = auth.uid() AND id = provider_id AND is_active = true
  )
);

CREATE POLICY "Admins can manage patient assignments" 
ON public.patient_provider_assignments FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.healthcare_providers 
    WHERE user_id = auth.uid() AND provider_type = 'admin' AND is_active = true
  )
);

-- Secure policies for PHI access logs
CREATE POLICY "Admins and auditors can view access logs" 
ON public.phi_access_logs FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.healthcare_providers 
    WHERE user_id = auth.uid() 
    AND provider_type IN ('admin', 'auditor') 
    AND is_active = true
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_healthcare_providers_updated_at
BEFORE UPDATE ON public.healthcare_providers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();