-- Add XPC chart review fields to risk_assessments table
ALTER TABLE risk_assessments 
ADD COLUMN xpc_chart_review jsonb DEFAULT NULL,
ADD COLUMN chart_quality_score integer DEFAULT NULL,
ADD COLUMN chart_review_domains jsonb DEFAULT '[]'::jsonb;

-- Add index for chart review queries
CREATE INDEX idx_risk_assessments_chart_quality ON risk_assessments(chart_quality_score) WHERE chart_quality_score IS NOT NULL;