import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileTabs } from '@/components/ui/mobile-tabs';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { 
  Brain, 
  Activity, 
  FileText, 
  Calendar, 
  Pill, 
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { Patient } from './PatientDashboard';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClinicalInsightsProps {
  patient: Patient;
}

export const ClinicalInsights = ({ patient }: ClinicalInsightsProps) => {
  const isMobile = useIsMobile();
  
  const clinicalAlerts = [
    {
      type: 'critical',
      icon: AlertCircle,
      title: 'BP Crisis Risk',
      description: 'Blood pressure readings indicate potential hypertensive crisis',
      action: 'Schedule immediate follow-up',
      timestamp: '2 hours ago'
    },
    {
      type: 'warning',
      icon: Clock,
      title: 'Medication Gap',
      description: 'Patient missed last 2 metformin doses',
      action: 'Contact patient for adherence check',
      timestamp: '1 day ago'
    },
    {
      type: 'info',
      icon: CheckCircle2,
      title: 'Lab Results Ready',
      description: 'HbA1c and lipid panel results available for review',
      action: 'Review and discuss with patient',
      timestamp: '3 hours ago'
    }
  ];

  const careTeamActions = [
    {
      role: 'Primary Care',
      action: 'Adjust antihypertensive therapy',
      priority: 'high',
      dueDate: 'Today'
    },
    {
      role: 'Endocrinology',
      action: 'Diabetes management consultation',
      priority: 'medium',
      dueDate: 'Within 1 week'
    },
    {
      role: 'Pharmacist',
      action: 'Medication reconciliation and adherence counseling',
      priority: 'high',
      dueDate: 'Within 2 days'
    },
    {
      role: 'Care Coordinator',
      action: 'Patient education on BP monitoring',
      priority: 'medium',
      dueDate: 'Within 3 days'
    }
  ];

  const predictionInsights = [
    {
      condition: 'Cardiovascular Event',
      probability: '23%',
      timeframe: 'Next 6 months',
      confidence: '89%',
      type: 'high-risk'
    },
    {
      condition: 'Hospital Readmission',
      probability: '15%',
      timeframe: 'Next 30 days',
      confidence: '76%',
      type: 'medium-risk'
    },
    {
      condition: 'Diabetic Complication',
      probability: '8%',
      timeframe: 'Next 12 months',
      confidence: '92%',
      type: 'low-risk'
    }
  ];

  const getAlertIcon = (type: string) => {
    const alert = clinicalAlerts.find(a => a.type === type);
    if (!alert) return AlertCircle;
    return alert.icon;
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'critical';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'critical';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'high-risk': return 'critical';
      case 'medium-risk': return 'warning';
      case 'low-risk': return 'success';
      default: return 'secondary';
    }
  };

  const tabsConfig = [
    { value: 'alerts', label: 'Alerts', icon: AlertCircle },
    { value: 'predictions', label: 'Predictions', icon: TrendingUp },
    { value: 'actions', label: 'Care Team', icon: Users },
    { value: 'ai-consult', label: 'AI Consult', icon: Brain },
    { value: 'timeline', label: 'Timeline', icon: Calendar }
  ];

  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case 'alerts':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mobile-text-responsive">Active Clinical Alerts</h3>
            {clinicalAlerts.map((alert, index) => {
              const IconComponent = alert.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border mobile-card">
                  <IconComponent className={`w-5 h-5 mt-0.5 text-${getAlertColor(alert.type)} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                      <h4 className="font-medium mobile-text-responsive truncate">{alert.title}</h4>
                      <Badge className={`bg-${getAlertColor(alert.type)} text-${getAlertColor(alert.type)}-foreground self-start sm:self-auto`}>
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 space-y-2 sm:space-y-0">
                      <Button variant="outline" size="sm" className="mobile-touch-target self-start">
                        {alert.action}
                      </Button>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'predictions':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mobile-text-responsive">Risk Predictions</h3>
            {predictionInsights.map((prediction, index) => (
              <div key={index} className="p-4 rounded-lg border mobile-card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                  <h4 className="font-medium mobile-text-responsive">{prediction.condition}</h4>
                  <Badge className={`bg-${getRiskColor(prediction.type)} text-${getRiskColor(prediction.type)}-foreground self-start sm:self-auto`}>
                    {prediction.probability} risk
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Timeframe:</span>
                    <div className="font-medium">{prediction.timeframe}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">AI Confidence:</span>
                    <div className="font-medium">{prediction.confidence}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'actions':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mobile-text-responsive">Care Team Actions</h3>
            {careTeamActions.map((action, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border mobile-card space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Stethoscope className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium mobile-text-responsive truncate">{action.role}</div>
                    <div className="text-sm text-muted-foreground">{action.action}</div>
                  </div>
                </div>
                <div className="flex flex-col sm:text-right space-y-1">
                  <Badge className={`bg-${getPriorityColor(action.priority)} text-${getPriorityColor(action.priority)}-foreground self-start sm:self-end`}>
                    {action.priority.toUpperCase()}
                  </Badge>
                  <div className="text-xs text-muted-foreground">{action.dueDate}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'ai-consult':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mobile-text-responsive">MedGemma AI Consultation</h3>
            {patient.riskAssessments?.some((r: any) => r.ai_consultation) ? (
              <div className="space-y-4">
                {patient.riskAssessments
                  .filter((r: any) => r.ai_consultation)
                  .map((assessment: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg border border-primary/20 bg-primary/5 mobile-card">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-primary" />
                          <span className="font-medium text-primary mobile-text-responsive">
                            {assessment.ai_consultation.modelVersion}
                          </span>
                        </div>
                        <Badge variant="secondary" className="self-start sm:self-auto">
                          {Math.round(assessment.ai_consultation.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm text-muted-foreground mb-2">Clinical Query:</p>
                          <p className="text-sm font-mono whitespace-pre-wrap break-words">{assessment.ai_consultation.query}</p>
                        </div>
                        <div className="bg-primary/5 p-3 rounded-md">
                          <p className="text-sm text-primary mb-2">AI Response:</p>
                          {assessment.ai_consultation.response && assessment.ai_consultation.response.length > 10 ? (
                            <MarkdownRenderer 
                              content={assessment.ai_consultation.response}
                              className="text-sm"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              AI consultation is processing. Please wait for the analysis to complete.
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground space-y-1 sm:space-y-0">
                          <span>Session: {assessment.ai_consultation.sessionId?.substring(0, 8)}...</span>
                          <span>Generated: {new Date(assessment.assessment_date).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium text-muted-foreground mb-2 mobile-text-responsive">Generating AI Consultation...</h4>
                <p className="text-sm text-muted-foreground">
                  Keywell MedGemma analysis is being generated automatically for this patient
                </p>
              </div>
            )}
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mobile-text-responsive">Care Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 mobile-card">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium mobile-text-responsive">Last Visit</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(patient.lastVisit).toLocaleDateString()} - Routine check-up
                  </div>
                </div>
              </div>
              {patient.nextAppointment && (
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-primary/20 mobile-card">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium mobile-text-responsive">Next Appointment</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(patient.nextAppointment).toLocaleDateString()} - Follow-up visit
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3 p-3 rounded-lg border mobile-card">
                <Pill className="w-4 h-4 text-info flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium mobile-text-responsive">Medication Review</div>
                  <div className="text-sm text-muted-foreground">
                    Recommended within 2 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mobile-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center mobile-text-responsive">
          <Brain className="w-5 h-5 mr-2 text-primary" />
          AI Clinical Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isMobile ? (
          <MobileTabs
            tabs={tabsConfig}
            defaultValue="alerts"
            className="w-full"
          >
            {renderTabContent}
          </MobileTabs>
        ) : (
          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="actions">Care Team</TabsTrigger>
              <TabsTrigger value="ai-consult">AI Consult</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            {tabsConfig.map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                {renderTabContent(tab.value)}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};