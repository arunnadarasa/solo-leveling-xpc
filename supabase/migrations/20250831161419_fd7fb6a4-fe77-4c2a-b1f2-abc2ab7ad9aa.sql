-- Fix the healthcare_providers table creation issue and complete security setup
-- First, check if we need to create provider profiles for existing demo users

-- Create a trigger to automatically create provider profiles for new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
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

-- Create trigger for automatic provider profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create demo admin user and assign all existing patients to them
-- This ensures continuity while we implement proper patient-provider assignments
DO $$
DECLARE
  demo_admin_id UUID := '00000000-0000-0000-0000-000000000001';
  patient_rec RECORD;
BEGIN
  -- Create demo admin provider if not exists
  INSERT INTO public.healthcare_providers (
    id,
    user_id,
    provider_type,
    first_name,
    last_name,
    email,
    license_number,
    is_active
  ) VALUES (
    demo_admin_id,
    demo_admin_id,
    'admin',
    'Demo',
    'Administrator',
    'admin@demo.clinical',
    'ADMIN001',
    true
  ) ON CONFLICT (user_id) DO NOTHING;

  -- Assign all existing patients to the demo admin
  FOR patient_rec IN SELECT id FROM public.patients LOOP
    INSERT INTO public.patient_provider_assignments (
      patient_id,
      provider_id,
      assigned_by,
      is_active
    ) VALUES (
      patient_rec.id,
      demo_admin_id,
      demo_admin_id,
      true
    ) ON CONFLICT (patient_id, provider_id) DO NOTHING;
  END LOOP;
END $$;