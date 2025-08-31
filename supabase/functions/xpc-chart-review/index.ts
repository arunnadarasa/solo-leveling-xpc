import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Domain {
  name: string;
  evaluationCriteria: string;
}

interface ChartReviewRequest {
  domains: Domain[];
  chart: any;
}

interface DomainReview {
  name: string;
  review: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientId } = await req.json();

    if (!patientId) {
      return new Response(JSON.stringify({ error: 'Patient ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const xpcApiKey = Deno.env.get('XPC_API');

    if (!xpcApiKey) {
      console.error('XPC_API key not found in environment variables');
      return new Response(JSON.stringify({ error: 'XPC API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch patient data
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select(`
        *,
        patient_conditions (*),
        patient_vitals (*),
        risk_assessments (*)
      `)
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      console.error('Error fetching patient:', patientError);
      return new Response(JSON.stringify({ error: 'Patient not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare chart data for XPC API
    const chartData = {
      patientId: patient.id,
      reviewDate: new Date().toISOString().split('T')[0],
      demographics: {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        mrn: patient.mrn
      },
      conditions: patient.patient_conditions?.map((condition: any) => ({
        name: condition.condition_name,
        icdCode: condition.icd_code,
        severity: condition.severity,
        status: condition.status,
        onsetDate: condition.onset_date
      })) || [],
      vitals: patient.patient_vitals?.length > 0 ? {
        bloodPressure: `${patient.patient_vitals[0].blood_pressure_systolic}/${patient.patient_vitals[0].blood_pressure_diastolic}`,
        heartRate: patient.patient_vitals[0].heart_rate,
        temperature: patient.patient_vitals[0].temperature,
        oxygenSaturation: patient.patient_vitals[0].oxygen_saturation,
        bmi: patient.patient_vitals[0].bmi,
        recordedAt: patient.patient_vitals[0].recorded_at
      } : null,
      riskAssessments: patient.risk_assessments?.map((assessment: any) => ({
        riskScore: assessment.overall_risk_score,
        riskLevel: assessment.risk_level,
        assessmentDate: assessment.assessment_date,
        aiRecommendations: assessment.ai_recommendations
      })) || []
    };

    // Define evaluation domains
    const domains: Domain[] = [
      {
        name: "Clinical Documentation",
        evaluationCriteria: "Assess completeness of patient history, current medications, vital signs, and assessment notes. Evaluate documentation quality and clinical reasoning."
      },
      {
        name: "Treatment Plan",
        evaluationCriteria: "Evaluate appropriateness of diagnosis, treatment plan, and follow-up instructions based on patient conditions and risk factors."
      },
      {
        name: "Patient Safety",
        evaluationCriteria: "Review medication reconciliation, allergy documentation, safety protocols, and risk mitigation strategies."
      },
      {
        name: "Care Coordination",
        evaluationCriteria: "Assess care team communication, referral management, and continuity of care documentation."
      }
    ];

    const requestBody: ChartReviewRequest = {
      domains,
      chart: chartData
    };

    console.log('Sending request to XPC Chart Review API...');
    
    // Call XPC Chart Review API
    const xpcResponse = await fetch('https://hackathon-api.xprimarycare.com/chart-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': xpcApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!xpcResponse.ok) {
      const errorText = await xpcResponse.text();
      console.error('XPC API error:', xpcResponse.status, errorText);
      
      if (xpcResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'Chart review service temporarily unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const xpcResult = await xpcResponse.json();
    console.log('XPC API response received');

    // Calculate chart quality score (0-100) based on domain reviews
    const calculateChartQuality = (domainReviews: DomainReview[]): number => {
      let totalScore = 0;
      
      for (const domain of domainReviews) {
        const review = domain.review.toLowerCase();
        let domainScore = 50; // Base score
        
        // Positive indicators
        if (review.includes('comprehensive') || review.includes('complete')) domainScore += 15;
        if (review.includes('well-organized') || review.includes('clear')) domainScore += 10;
        if (review.includes('appropriate') || review.includes('excellent')) domainScore += 15;
        if (review.includes('properly') || review.includes('accurate')) domainScore += 10;
        
        // Negative indicators
        if (review.includes('missing') || review.includes('incomplete')) domainScore -= 20;
        if (review.includes('unclear') || review.includes('inadequate')) domainScore -= 15;
        if (review.includes('concerns') || review.includes('issues')) domainScore -= 10;
        
        totalScore += Math.max(0, Math.min(100, domainScore));
      }
      
      return Math.round(totalScore / domainReviews.length);
    };

    const chartQualityScore = calculateChartQuality(xpcResult.domains);

    // Store results in risk_assessments table
    const { error: updateError } = await supabase
      .from('risk_assessments')
      .upsert({
        patient_id: patientId,
        assessment_date: new Date().toISOString(),
        overall_risk_score: patient.risk_assessments?.[0]?.overall_risk_score || 50,
        risk_level: patient.risk_assessments?.[0]?.risk_level || 'moderate',
        risk_factors: patient.risk_assessments?.[0]?.risk_factors || [],
        xpc_chart_review: xpcResult,
        chart_quality_score: chartQualityScore,
        chart_review_domains: xpcResult.domains,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      });

    if (updateError) {
      console.error('Error storing chart review results:', updateError);
    }

    return new Response(JSON.stringify({
      success: true,
      chartReview: xpcResult,
      chartQualityScore,
      message: 'Chart review completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in XPC chart review function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});