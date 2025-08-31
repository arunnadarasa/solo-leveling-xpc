-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view all provider profiles" ON public.healthcare_providers;

-- Create a security definer function to safely check admin status
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.healthcare_providers hp
    WHERE hp.user_id = auth.uid() 
    AND hp.provider_type = 'admin'
    AND hp.is_active = true
  );
$$;

-- Create safe admin policy using the function
CREATE POLICY "Admins can view all provider profiles"
ON public.healthcare_providers
FOR SELECT
TO authenticated
USING (public.is_admin_user());

-- Ensure providers can still view their own profile (this should already exist but let's be safe)
DROP POLICY IF EXISTS "Providers can view their own profile" ON public.healthcare_providers;
CREATE POLICY "Providers can view their own profile"
ON public.healthcare_providers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Ensure providers can update their own profile (this should already exist but let's be safe)
DROP POLICY IF EXISTS "Providers can update their own profile" ON public.healthcare_providers;
CREATE POLICY "Providers can update their own profile"
ON public.healthcare_providers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);