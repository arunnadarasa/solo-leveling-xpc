import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Activity, Heart, Brain, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { PatientList } from './PatientList';
import { RiskVisualization } from './RiskVisualization';
import { ClinicalInsights } from './ClinicalInsights';
import { DemoControls } from '../demo/DemoControls';
import { usePatients } from '@/hooks/usePatients';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Patient {
  id: string;
  name: string;
  age: number;
  mrn: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  conditions: string[];
  lastVisit: string;
  nextAppointment?: string;
  alerts: number;
  riskAssessments?: any[];
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSat: number;
  };
}

export const PatientDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { patients, loading, error, refetch } = usePatients();
  const { toast } = useToast();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'critical';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const runAIAnalysis = async (type: 'phenoml' | 'metriport' | 'keywell') => {
    if (!selectedPatient) {
      toast({
        title: "No Patient Selected",
        description: "Please select a patient to run AI analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('clinical-ai-analysis', {
        body: {
          patientId: selectedPatient.id,
          type: type
        }
      });

      if (error) throw error;

      toast({
        title: `${type === 'phenoml' ? 'PhenoML' : type === 'metriport' ? 'Metriport' : 'Keywell MedGemma'} Analysis Complete`,
        description: `AI analysis completed successfully. Risk score updated to ${data.analysis.riskScore}`,
      });

      // Refresh patient data
      await refetch();
      
    } catch (err) {
      console.error('AI Analysis error:', err);
      toast({
        title: "Analysis Failed",
        description: "Failed to complete AI analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const totalAlerts = patients.reduce((sum, patient) => sum + patient.alerts, 0);
  const highRiskPatients = patients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clinical Decision Support</h1>
            <p className="text-muted-foreground">AI-powered patient risk assessment and care recommendations</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="destructive" className="bg-critical text-critical-foreground">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {totalAlerts} Active Alerts
            </Badge>
            <Button 
              variant="outline" 
              onClick={() => runAIAnalysis('phenoml')}
              disabled={isAnalyzing || !selectedPatient}
            >
              <Brain className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Run PhenoML Analysis'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => runAIAnalysis('metriport')}
              disabled={isAnalyzing || !selectedPatient}
            >
              <Activity className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Processing...' : 'Metriport Integration'}
            </Button>
            <Button variant="outline" onClick={refetch} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground">
                Active in system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{highRiskPatients}</div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Activity className="h-4 w-4 text-critical" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-critical">{totalAlerts}</div>
              <p className="text-xs text-muted-foreground">
                Across all patients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
              <Brain className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">94%</div>
              <p className="text-xs text-muted-foreground">
                Risk prediction accuracy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading patient data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={refetch}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Patient List */}
            <div className="lg:col-span-1">
              <PatientList 
                patients={patients}
                selectedPatient={selectedPatient}
                onSelectPatient={setSelectedPatient}
                getRiskColor={getRiskColor}
              />
              
              {/* Demo Controls */}
              <div className="mt-6">
                <DemoControls 
                  onRunAnalysis={runAIAnalysis}
                  isAnalyzing={isAnalyzing}
                  selectedPatient={selectedPatient}
                />
              </div>
            </div>

            {/* Patient Details & Insights */}
            <div className="lg:col-span-3 space-y-6">
              {selectedPatient ? (
                <>
                  {/* Patient Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{selectedPatient.name}</CardTitle>
                          <CardDescription>
                            Age {selectedPatient.age} • MRN: {selectedPatient.mrn}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`bg-${getRiskColor(selectedPatient.riskLevel)} text-${getRiskColor(selectedPatient.riskLevel)}-foreground`}>
                            Risk Score: {selectedPatient.riskScore}
                          </Badge>
                          {selectedPatient.alerts > 0 && (
                            <Badge variant="destructive">
                              {selectedPatient.alerts} Alerts
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedPatient.vitals && (
                          <>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Blood Pressure</div>
                              <div className="font-semibold">{selectedPatient.vitals.bloodPressure}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Heart Rate</div>
                              <div className="font-semibold">{selectedPatient.vitals.heartRate} bpm</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Temperature</div>
                              <div className="font-semibold">{selectedPatient.vitals.temperature}°F</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">O2 Sat</div>
                              <div className="font-semibold">{selectedPatient.vitals.oxygenSat}%</div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <RiskVisualization patient={selectedPatient} />
                  <ClinicalInsights patient={selectedPatient} />
                </>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">Select a patient to view details</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};