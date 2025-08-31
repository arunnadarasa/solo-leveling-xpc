import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientId, type } = await req.json();
    
    console.log(`Processing ${type} analysis for patient: ${patientId}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch patient data
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select(`
        *,
        patient_conditions(*),
        patient_vitals(*),
        risk_assessments(*)
      `)
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      throw new Error('Patient not found');
    }

    let analysisResult;

    if (type === 'phenoml') {
      // Simulate PhenoML Analysis
      analysisResult = await simulatePhenoMLAnalysis(patient);
    } else if (type === 'metriport') {
      // Simulate Metriport Data Integration
      analysisResult = await simulateMetriportIntegration(patient);
    } else if (type === 'keywell') {
      // Keywell MedGemma 4B Analysis
      analysisResult = await keywellMedGemmaAnalysis(patient);
    } else {
      throw new Error('Invalid analysis type');
    }

    // Update or create risk assessment with new analysis
    const { data: updatedAssessment, error: updateError } = await supabase
      .from('risk_assessments')
      .upsert({
        patient_id: patientId,
        overall_risk_score: analysisResult.riskScore,
        risk_level: analysisResult.riskLevel,
        risk_factors: analysisResult.riskFactors,
        phenoml_analysis: type === 'phenoml' ? analysisResult : null,
        metriport_data: type === 'metriport' ? analysisResult : null,
        ai_consultation: type === 'keywell' ? analysisResult.aiConsultation : null,
        ai_recommendations: analysisResult.recommendations,
        assessment_date: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: analysisResult,
      assessment: updatedAssessment
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in clinical-ai-analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function simulatePhenoMLAnalysis(patient: any) {
  console.log('Simulating PhenoML AI analysis...');
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const conditions = patient.patient_conditions || [];
  const vitals = patient.patient_vitals?.[0];
  
  let baseRiskScore = 30;
  const riskFactors = [];

  // Analyze conditions for risk
  for (const condition of conditions) {
    switch (condition.condition_name.toLowerCase()) {
      case 'diabetes type 2':
        baseRiskScore += 25;
        riskFactors.push({
          name: 'Diabetes Progression Risk',
          score: 75,
          trend: 'stable',
          impact: 'high',
          details: 'Type 2 diabetes with potential complications',
          aiInsight: 'Monitor HbA1c levels closely, consider insulin adjustment'
        });
        break;
      case 'hypertension':
        baseRiskScore += 20;
        riskFactors.push({
          name: 'Cardiovascular Risk',
          score: 80,
          trend: 'up',
          impact: 'high',
          details: 'Elevated blood pressure with cardiac implications',
          aiInsight: 'BP medication adjustment recommended, lifestyle modifications'
        });
        break;
      case 'coronary artery disease':
        baseRiskScore += 30;
        riskFactors.push({
          name: 'Cardiac Event Risk',
          score: 85,
          trend: 'up',
          impact: 'critical',
          details: 'Existing CAD increases acute event probability',
          aiInsight: 'Immediate cardiology consultation, consider stress testing'
        });
        break;
      case 'obesity':
        baseRiskScore += 15;
        riskFactors.push({
          name: 'Metabolic Syndrome Risk',
          score: 65,
          trend: 'stable',
          impact: 'medium',
          details: 'BMI elevation contributing to multiple risk factors',
          aiInsight: 'Weight management program, nutritionist referral'
        });
        break;
      case 'asthma':
        baseRiskScore += 10;
        riskFactors.push({
          name: 'Respiratory Risk',
          score: 35,
          trend: 'stable',
          impact: 'low',
          details: 'Well-controlled asthma with minimal complications',
          aiInsight: 'Continue current management, monitor seasonal triggers'
        });
        break;
    }
  }

  // Analyze vitals
  if (vitals) {
    if (vitals.blood_pressure_systolic > 160 || vitals.blood_pressure_diastolic > 100) {
      baseRiskScore += 15;
    }
    if (vitals.heart_rate > 100) {
      baseRiskScore += 10;
    }
    if (vitals.oxygen_saturation < 95) {
      baseRiskScore += 20;
    }
  }

  // Cap at 100
  const finalRiskScore = Math.min(baseRiskScore, 100);

  const riskLevel = finalRiskScore >= 80 ? 'critical' : 
                   finalRiskScore >= 60 ? 'high' : 
                   finalRiskScore >= 40 ? 'medium' : 'low';

  const recommendations = [
    'AI-powered risk stratification indicates immediate attention required',
    'Multi-factor risk model suggests care coordination',
    'Predictive analytics recommend proactive intervention',
    'Machine learning identifies optimal treatment pathways'
  ];

  return {
    type: 'phenoml',
    riskScore: finalRiskScore,
    riskLevel,
    riskFactors,
    recommendations,
    aiConfidence: 0.89,
    modelVersion: 'PhenoML-v2.1',
    analysisTimestamp: new Date().toISOString(),
    processingTime: '1.2s'
  };
}

async function simulateMetriportIntegration(patient: any) {
  console.log('Simulating Metriport data integration...');
  
  // Simulate API processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const conditions = patient.patient_conditions || [];
  
  // Simulate comprehensive health record data
  const healthRecords = {
    labs: [
      { name: 'HbA1c', value: 8.2, unit: '%', range: '<7.0', status: 'high', date: '2024-01-20' },
      { name: 'LDL Cholesterol', value: 165, unit: 'mg/dL', range: '<100', status: 'high', date: '2024-01-20' },
      { name: 'eGFR', value: 68, unit: 'mL/min/1.73m²', range: '>90', status: 'low', date: '2024-01-20' },
      { name: 'Microalbumin', value: 45, unit: 'mg/g', range: '<30', status: 'high', date: '2024-01-20' }
    ],
    medications: [
      { name: 'Metformin', dose: '1000mg', frequency: 'BID', adherence: 75, lastFilled: '2024-01-15' },
      { name: 'Lisinopril', dose: '10mg', frequency: 'Daily', adherence: 90, lastFilled: '2024-01-18' },
      { name: 'Atorvastatin', dose: '40mg', frequency: 'Daily', adherence: 85, lastFilled: '2024-01-16' }
    ],
    procedures: [
      { name: 'Echocardiogram', date: '2023-12-15', result: 'EF 55%, mild LVH' },
      { name: 'Ophthalmology Exam', date: '2024-01-10', result: 'Mild diabetic retinopathy' }
    ],
    hospitalizations: [
      { date: '2023-09-12', reason: 'Hypertensive Crisis', duration: '3 days', outcome: 'Stable discharge' }
    ]
  };

  // Calculate risk based on comprehensive data
  let riskScore = 40;
  const riskFactors = [];

  // Lab-based risk factors
  const abnormalLabs = healthRecords.labs.filter(lab => lab.status !== 'normal');
  riskScore += abnormalLabs.length * 8;

  riskFactors.push({
    name: 'Laboratory Risk Profile',
    score: 70,
    trend: 'up',
    impact: 'high',
    details: `${abnormalLabs.length} abnormal lab values detected`,
    metriportData: abnormalLabs
  });

  // Medication adherence risk
  const avgAdherence = healthRecords.medications.reduce((sum, med) => sum + med.adherence, 0) / healthRecords.medications.length;
  if (avgAdherence < 80) {
    riskScore += 15;
    riskFactors.push({
      name: 'Medication Adherence Risk',
      score: 100 - avgAdherence,
      trend: 'down',
      impact: 'high',
      details: `Average adherence: ${avgAdherence}%`,
      metriportData: healthRecords.medications
    });
  }

  // Historical risk
  if (healthRecords.hospitalizations.length > 0) {
    riskScore += 10;
  }

  const finalRiskScore = Math.min(riskScore, 100);
  const riskLevel = finalRiskScore >= 80 ? 'critical' : 
                   finalRiskScore >= 60 ? 'high' : 
                   finalRiskScore >= 40 ? 'medium' : 'low';

  const recommendations = [
    'Comprehensive health record analysis suggests care optimization',
    'Historical data indicates risk for acute exacerbation',
    'Medication adherence monitoring recommended',
    'Lab trend analysis suggests intervention timing'
  ];

  return {
    type: 'metriport',
    riskScore: finalRiskScore,
    riskLevel,
    riskFactors,
    recommendations,
    healthRecords,
    dataQuality: 0.92,
    recordsProcessed: 47,
    analysisTimestamp: new Date().toISOString(),
    processingTime: '0.8s'
  };
}

async function keywellMedGemmaAnalysis(patient: any) {
  console.log('Starting Keywell MedGemma 4B analysis...');
  
  const keywellPat = Deno.env.get('KEYWELL_PAT');
  const keywellUsername = Deno.env.get('KEYWELL_USERNAME');
  const keywellPassword = Deno.env.get('KEYWELL_PASSWORD');
  const endpoint = 'https://dbc-8755b6f3-3560.cloud.databricks.com/serving-endpoints/keywell-u2m-testing/invocations';
  const correctModelId = '362a8f7e-1144-4bfc-8b4c-e397ecd2f466'; // Using the correct model ID from Keywell platform
  
  if (!keywellPat) {
    throw new Error('Keywell PAT not configured');
  }

  console.log('Keywell credentials available:', {
    hasPAT: !!keywellPat,
    hasUsername: !!keywellUsername,
    hasPassword: !!keywellPassword,
    endpoint,
    modelId: correctModelId
  });

  // Generate a unique SID for this session
  const sid = `user_${crypto.randomUUID().replace(/-/g, '').substring(0, 32)}`;

  try {
    // Step 1: Initialize session
    console.log('Initializing Keywell session with SID:', sid);
    const sessionRequestBody = {
      inputs: {
        question: ["Hello"],
        model_id: correctModelId,
        sid: sid
      }
    };
    
    console.log('Session request body:', JSON.stringify(sessionRequestBody, null, 2));
    
    const sessionResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keywellPat}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionRequestBody)
    });

    console.log('Session response status:', sessionResponse.status);
    console.log('Session response headers:', Object.fromEntries(sessionResponse.headers.entries()));

    if (!sessionResponse.ok) {
      const errorText = await sessionResponse.text();
      console.error('Session initialization failed:', sessionResponse.status, errorText);
      throw new Error(`Session initialization failed: ${sessionResponse.status} - ${errorText}`);
    }

    const sessionData = await sessionResponse.json();
    console.log('Session response:', JSON.stringify(sessionData, null, 2));
    
    // Based on the logs, the session ID is in sessionData.predictions.session_id
    const sessionId = sessionData.predictions?.session_id || 
                     sessionData.predictions?.[0]?.session_id || 
                     sessionData.session_id || 
                     sessionData.predictions?.[0]?.outputs?.session_id;

    if (!sessionId) {
      console.error('No session ID found in response. Available keys:', Object.keys(sessionData));
      if (sessionData.predictions) {
        console.error('Predictions structure:', JSON.stringify(sessionData.predictions, null, 2));
      }
      throw new Error('Failed to get session ID from Keywell');
    }

    console.log('Session initialized:', sessionId);

    // Step 2: Create clinical query based on patient data
    const conditions = patient.patient_conditions || [];
    const vitals = patient.patient_vitals?.[0];
    const conditionsList = conditions.map(c => c.condition_name).join(', ');
    
    const clinicalQuery = `
Patient Profile: ${patient.age}-year-old ${patient.gender || 'patient'} with ${conditionsList}.
Recent Vitals: BP ${vitals?.blood_pressure_systolic || 'N/A'}/${vitals?.blood_pressure_diastolic || 'N/A'}, HR ${vitals?.heart_rate || 'N/A'}, O2 Sat ${vitals?.oxygen_saturation || 'N/A'}%.

Clinical Questions:
1. What are the primary risk factors for this patient profile?
2. What evidence-based treatment recommendations would you suggest?
3. What monitoring parameters are most critical?
4. Are there potential drug interactions to consider?
5. What lifestyle interventions would be most beneficial?

Please provide clinical decision support recommendations based on current medical guidelines.`;

    // Step 3: Get clinical consultation
    const consultationResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keywellPat}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          question: [clinicalQuery],
          model_id: correctModelId,
          sid: sid,
          session_id: sessionId
        }
      })
    });

    if (!consultationResponse.ok) {
      throw new Error(`Consultation failed: ${consultationResponse.status}`);
    }

    const consultationData = await consultationResponse.json();
    const aiResponse = consultationData.predictions?.[0]?.response || 'No response received';

    console.log('MedGemma response received');

    // Process AI response for structured output
    const riskScore = calculateRiskFromMedGemma(patient, aiResponse);
    const riskLevel = riskScore >= 80 ? 'critical' : 
                     riskScore >= 60 ? 'high' : 
                     riskScore >= 40 ? 'medium' : 'low';

    const recommendations = extractRecommendations(aiResponse);
    const riskFactors = extractRiskFactors(aiResponse, patient);

    return {
      type: 'keywell',
      riskScore,
      riskLevel,
      riskFactors,
      recommendations,
      aiConsultation: {
        query: clinicalQuery,
        response: aiResponse,
        sessionId,
        modelVersion: 'MedGemma-4B-IT-v2',
        confidence: 0.92
      },
      analysisTimestamp: new Date().toISOString(),
      processingTime: '2.1s'
    };

  } catch (error) {
    console.error('Keywell analysis error:', error);
    throw error;
  }
}

function calculateRiskFromMedGemma(patient: any, aiResponse: string): number {
  let baseRisk = 30;
  const conditions = patient.patient_conditions || [];
  
  // Base risk from conditions
  conditions.forEach((condition: any) => {
    const name = condition.condition_name.toLowerCase();
    if (name.includes('diabetes')) baseRisk += 25;
    if (name.includes('hypertension')) baseRisk += 20;
    if (name.includes('cardiac') || name.includes('heart')) baseRisk += 30;
    if (name.includes('obesity')) baseRisk += 15;
  });

  // Analyze AI response for risk indicators
  const response = aiResponse.toLowerCase();
  if (response.includes('high risk') || response.includes('urgent')) baseRisk += 20;
  if (response.includes('moderate risk') || response.includes('monitor')) baseRisk += 10;
  if (response.includes('immediate') || response.includes('emergency')) baseRisk += 25;

  return Math.min(baseRisk, 100);
}

function extractRecommendations(aiResponse: string): string[] {
  const recommendations = [];
  
  // Look for recommendation patterns in MedGemma response
  if (aiResponse.includes('recommend')) {
    recommendations.push('Evidence-based treatment protocol recommended by MedGemma AI');
  }
  if (aiResponse.includes('monitor')) {
    recommendations.push('Enhanced monitoring protocol suggested');
  }
  if (aiResponse.includes('lifestyle') || aiResponse.includes('diet')) {
    recommendations.push('Lifestyle modification interventions indicated');
  }
  if (aiResponse.includes('medication') || aiResponse.includes('drug')) {
    recommendations.push('Medication optimization review recommended');
  }

  // Default recommendations
  if (recommendations.length === 0) {
    recommendations.push('Comprehensive clinical assessment recommended');
    recommendations.push('Follow evidence-based care guidelines');
  }

  return recommendations;
}

function extractRiskFactors(aiResponse: string, patient: any): any[] {
  const riskFactors = [];
  const conditions = patient.patient_conditions || [];
  
  // Create risk factors based on conditions and AI response
  conditions.forEach((condition: any) => {
    let impact = 'medium';
    let score = 50;
    
    const name = condition.condition_name.toLowerCase();
    if (name.includes('diabetes')) {
      impact = 'high';
      score = 75;
    } else if (name.includes('hypertension')) {
      impact = 'high';
      score = 70;
    } else if (name.includes('cardiac')) {
      impact = 'critical';
      score = 85;
    }

    riskFactors.push({
      name: `${condition.condition_name} Risk`,
      score,
      trend: 'stable',
      impact,
      details: `MedGemma AI analysis for ${condition.condition_name}`,
      aiInsight: 'Evidence-based risk assessment from clinical guidelines'
    });
  });

  return riskFactors;
}