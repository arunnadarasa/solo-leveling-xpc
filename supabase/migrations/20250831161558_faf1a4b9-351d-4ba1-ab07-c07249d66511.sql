-- Fix security linter warning: Function Search Path Mutable
-- Update functions to have immutable search_path

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.healthcare_providers (
    user_id, 
    provider_type, 
    first_name, 
    last_name, 
    email,
    license_number,
    is_active
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'provider_type', 'doctor'),
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', 'Provider'),
    NEW.email,
    NEW.raw_user_meta_data ->> 'license_number',
    true
  );
  RETURN NEW;
END;
$$;

-- Update the has_patient_access function with proper search_path
CREATE OR REPLACE FUNCTION public.has_patient_access(user_uuid UUID, patient_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT 
    -- Admin users can see all patients
    EXISTS (
      SELECT 1 
      FROM public.healthcare_providers hp
      WHERE hp.user_id = user_uuid 
      AND hp.provider_type = 'admin'
      AND hp.is_active = true
    ) OR
    -- Specific patient-provider assignments
    EXISTS (
      SELECT 1 
      FROM public.healthcare_providers hp
      JOIN public.patient_provider_assignments ppa ON hp.id = ppa.provider_id
      WHERE hp.user_id = user_uuid 
      AND ppa.patient_id = patient_uuid 
      AND hp.is_active = true 
      AND ppa.is_active = true
    ) OR
    -- For demo purposes: any authenticated healthcare provider can see patients
    -- This should be removed in production
    EXISTS (
      SELECT 1 
      FROM public.healthcare_providers hp
      WHERE hp.user_id = user_uuid 
      AND hp.is_active = true
    );
$$;

-- Update the existing update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;