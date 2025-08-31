import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Activity, 
  FileText, 
  Calendar, 
  Pill, 
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Patient } from './PatientDashboard';

interface ClinicalInsightsProps {
  patient: Patient;
}

export const ClinicalInsights = ({ patient }: ClinicalInsightsProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 mr-2 text-primary" />
          AI Clinical Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="actions">Care Team</TabsTrigger>
            <TabsTrigger value="ai-consult">AI Consult</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <h3 className="font-semibold">Active Clinical Alerts</h3>
            {clinicalAlerts.map((alert, index) => {
              const IconComponent = alert.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <IconComponent className={`w-5 h-5 mt-0.5 text-${getAlertColor(alert.type)}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge className={`bg-${getAlertColor(alert.type)} text-${getAlertColor(alert.type)}-foreground`}>
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Button variant="outline" size="sm">
                        {alert.action}
                      </Button>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <h3 className="font-semibold">Risk Predictions</h3>
            {predictionInsights.map((prediction, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{prediction.condition}</h4>
                  <Badge className={`bg-${getRiskColor(prediction.type)} text-${getRiskColor(prediction.type)}-foreground`}>
                    {prediction.probability} risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
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
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <h3 className="font-semibold">Care Team Actions</h3>
            {careTeamActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium">{action.role}</div>
                    <div className="text-sm text-muted-foreground">{action.action}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`bg-${getPriorityColor(action.priority)} text-${getPriorityColor(action.priority)}-foreground mb-1`}>
                    {action.priority.toUpperCase()}
                  </Badge>
                  <div className="text-xs text-muted-foreground">{action.dueDate}</div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="ai-consult" className="space-y-4">
            <h3 className="font-semibold">MedGemma AI Consultation</h3>
            {patient.riskAssessments?.some((r: any) => r.aiConsultation) ? (
              <div className="space-y-4">
                {patient.riskAssessments
                  .filter((r: any) => r.aiConsultation)
                  .map((assessment: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-primary" />
                          <span className="font-medium text-primary">
                            {assessment.aiConsultation.modelVersion}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {Math.round(assessment.aiConsultation.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Clinical Query:</h4>
                          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            {assessment.aiConsultation.query.substring(0, 200)}...
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">AI Response:</h4>
                          <div className="text-sm bg-background p-3 rounded border">
                            {assessment.aiConsultation.response.substring(0, 500)}
                            {assessment.aiConsultation.response.length > 500 && '...'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Session: {assessment.aiConsultation.sessionId?.substring(0, 8)}...</span>
                          <span>Generated: {new Date(assessment.assessment_date).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium text-muted-foreground mb-2">No AI Consultation Available</h4>
                <p className="text-sm text-muted-foreground">
                  Run Keywell MedGemma analysis to get AI-powered clinical insights
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <h3 className="font-semibold">Care Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-medium">Last Visit</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(patient.lastVisit).toLocaleDateString()} - Routine check-up
                  </div>
                </div>
              </div>
              {patient.nextAppointment && (
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-primary/20">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium">Next Appointment</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(patient.nextAppointment).toLocaleDateString()} - Follow-up visit
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <Pill className="w-4 h-4 text-info" />
                <div>
                  <div className="font-medium">Medication Review</div>
                  <div className="text-sm text-muted-foreground">
                    Recommended within 2 days
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};