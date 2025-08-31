import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Activity, Heart, Brain, Users, TrendingUp, RefreshCw, Zap } from 'lucide-react';
import { PatientList } from './PatientList';
import { RiskVisualization } from './RiskVisualization';
import { ClinicalInsights } from './ClinicalInsights';
import { DemoControls } from '../demo/DemoControls';
import { MobileHeader } from '@/components/ui/mobile-header';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { useProgressivePatients } from '@/hooks/useProgressivePatients';
import { PatientListSkeleton, PatientDetailsSkeleton } from '@/components/ui/patient-skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { CanvasIntegration } from '@/components/canvas/CanvasIntegration';

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
  chartQualityScore?: number;
  chartReviewDomains?: Array<{
    name: string;
    review: string;
  }>;
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
  const { patients, loading, loadingStates, error, refetch } = useProgressivePatients();
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
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Mobile-optimized Header */}
        <MobileHeader
          totalAlerts={totalAlerts}
          isAnalyzing={isAnalyzing}
          loading={loading}
          selectedPatient={selectedPatient}
          onRunPhenoML={() => runAIAnalysis('phenoml')}
          onRunMetriport={() => runAIAnalysis('metriport')}
          onRefresh={refetch}
        />

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Canvas Integration Section */}
          <div className="mb-8">
            <CanvasIntegration />
          </div>

          {/* Overview Cards - Mobile Responsive */}
          <div className="mobile-grid-responsive">
            <Card className="mobile-card glass-card hover-scale animate-fade-in animation-delay-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground animate-pulse" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-xl sm:text-2xl font-bold glow-text">{patients.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active in system
                </p>
              </CardContent>
            </Card>

            <Card className="mobile-card glass-card hover-scale animate-fade-in animation-delay-200 glass-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning animate-pulse" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-xl sm:text-2xl font-bold text-warning glow-text">{highRiskPatients}</div>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card className="mobile-card glass-card hover-scale animate-fade-in animation-delay-300 glass-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <Activity className="h-4 w-4 text-critical animate-pulse" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-xl sm:text-2xl font-bold text-critical glow-text">{totalAlerts}</div>
                <p className="text-xs text-muted-foreground">
                  Across all patients
                </p>
              </CardContent>
            </Card>

            <Card className="mobile-card glass-card hover-scale animate-fade-in animation-delay-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                <Brain className="h-4 w-4 text-success animate-pulse" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-xl sm:text-2xl font-bold text-success glow-text">94%</div>
                <p className="text-xs text-muted-foreground">
                  Risk prediction accuracy
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Loading State - Progressive */}
          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground mobile-text-responsive">
                {loadingStates?.basic ? 'Loading patients...' : 
                 loadingStates?.details ? 'Loading patient details...' : 
                 loadingStates?.ai ? 'Generating AI consultations...' : 
                 'Loading...'}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-destructive mobile-card glass-card animate-fade-in">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4 animate-pulse" />
                  <p className="text-destructive mb-4 mobile-text-responsive">{error}</p>
                  <Button onClick={refetch} className="mobile-button glass-button">Try Again</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content - Mobile Responsive */}
          {!loading && !error && (
            <div className="space-y-4 sm:space-y-6">
              {/* Mobile: Stack vertically, Desktop: Grid layout */}
              <div className={isMobile ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-4 gap-6"}>
                {/* Patient List */}
                <div className={isMobile ? "" : "lg:col-span-1"}>
                  {loading ? (
                    <PatientListSkeleton />
                  ) : (
                    <PatientList 
                      patients={patients}
                      selectedPatient={selectedPatient}
                      onSelectPatient={setSelectedPatient}
                      getRiskColor={getRiskColor}
                    />
                  )}
                  
                  {/* Demo Controls - Hide on mobile when patient selected */}
                  {(!isMobile || !selectedPatient) && (
                    <div className="mt-4 sm:mt-6">
                      <DemoControls 
                        onRunAnalysis={runAIAnalysis}
                        isAnalyzing={isAnalyzing}
                        selectedPatient={selectedPatient}
                      />
                    </div>
                  )}
                </div>

                {/* Patient Details & Insights */}
                <div className={isMobile ? "space-y-4" : "lg:col-span-3 space-y-6"}>
                  {selectedPatient ? (
                    <>
                      {/* Show skeleton while details are loading */}
                      {loadingStates?.details ? (
                        <PatientDetailsSkeleton />
                      ) : (
                        <>
                          {/* Patient Header - Mobile Optimized */}
                          <Card className="mobile-card glass-card animate-fade-in">
                            <CardHeader className="pb-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="min-w-0 flex-1">
                                  <CardTitle className="text-lg sm:text-xl truncate">{selectedPatient.name}</CardTitle>
                                  <CardDescription className="mobile-text-responsive">
                                    Age {selectedPatient.age} • MRN: {selectedPatient.mrn}
                                  </CardDescription>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge className={`bg-${getRiskColor(selectedPatient.riskLevel)} text-${getRiskColor(selectedPatient.riskLevel)}-foreground`}>
                                    Risk: {selectedPatient.riskScore}
                                  </Badge>
                                  {selectedPatient.alerts > 0 && (
                                    <Badge variant="destructive">
                                      {selectedPatient.alerts} Alerts
                                    </Badge>
                                  )}
                                  {loadingStates?.ai && (
                                    <Badge variant="outline" className="animate-pulse">
                                      AI Processing...
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="mobile-vitals-grid">
                                {selectedPatient.vitals && (
                                  <>
                                    <div className="text-center p-2 rounded-lg bg-muted/50">
                                      <div className="text-xs sm:text-sm text-muted-foreground">Blood Pressure</div>
                                      <div className="font-semibold text-sm sm:text-base">{selectedPatient.vitals.bloodPressure}</div>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-muted/50">
                                      <div className="text-xs sm:text-sm text-muted-foreground">Heart Rate</div>
                                      <div className="font-semibold text-sm sm:text-base">{selectedPatient.vitals.heartRate} bpm</div>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-muted/50">
                                      <div className="text-xs sm:text-sm text-muted-foreground">Temperature</div>
                                      <div className="font-semibold text-sm sm:text-base">{selectedPatient.vitals.temperature}°F</div>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-muted/50">
                                      <div className="text-xs sm:text-sm text-muted-foreground">O2 Sat</div>
                                      <div className="font-semibold text-sm sm:text-base">{selectedPatient.vitals.oxygenSat}%</div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          <RiskVisualization patient={selectedPatient} />
                          <ClinicalInsights patient={selectedPatient} />
                        </>
                      )}
                    </>
                  ) : (
                    <Card className="mobile-card h-64 sm:h-96 flex items-center justify-center glass-card animate-fade-in">
                      <div className="text-center">
                        <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                        <p className="text-base sm:text-lg text-muted-foreground">Select a patient to view details</p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Floating Action Button for Mobile */}
          {isMobile && selectedPatient && (
            <FloatingActionButton
              onClick={() => runAIAnalysis('phenoml')}
              icon={Zap}
              label="Run AI Analysis"
              disabled={isAnalyzing}
            />
          )}
        </div>
      </div>
    </div>
  );
};