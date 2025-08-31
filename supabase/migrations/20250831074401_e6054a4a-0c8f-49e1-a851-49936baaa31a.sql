-- Add ai_consultation field to risk_assessments table to store Keywell AI consultation data
ALTER TABLE public.risk_assessments 
ADD COLUMN ai_consultation jsonb DEFAULT NULL;