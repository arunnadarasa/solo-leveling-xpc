import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Activity, Heart, Brain, Users, TrendingUp } from 'lucide-react';
import { PatientList } from './PatientList';
import { RiskVisualization } from './RiskVisualization';
import { ClinicalInsights } from './ClinicalInsights';

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
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSat: number;
  };
}

export const PatientDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 67,
      mrn: 'MRN001234',
      riskScore: 85,
      riskLevel: 'critical',
      conditions: ['Diabetes Type 2', 'Hypertension', 'CAD'],
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-01',
      alerts: 3,
      vitals: {
        bloodPressure: '165/95',
        heartRate: 92,
        temperature: 98.6,
        oxygenSat: 96
      }
    },
    {
      id: '2',
      name: 'Michael Chen',
      age: 45,
      mrn: 'MRN001235',
      riskScore: 65,
      riskLevel: 'high',
      conditions: ['Obesity', 'Pre-diabetes'],
      lastVisit: '2024-01-20',
      alerts: 1,
      vitals: {
        bloodPressure: '140/85',
        heartRate: 78,
        temperature: 98.4,
        oxygenSat: 98
      }
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      age: 32,
      mrn: 'MRN001236',
      riskScore: 35,
      riskLevel: 'medium',
      conditions: ['Asthma'],
      lastVisit: '2024-01-25',
      alerts: 0,
      vitals: {
        bloodPressure: '125/80',
        heartRate: 72,
        temperature: 98.2,
        oxygenSat: 99
      }
    }
  ]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'critical';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
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
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <PatientList 
              patients={patients}
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
              getRiskColor={getRiskColor}
            />
          </div>

          {/* Patient Details & Insights */}
          <div className="lg:col-span-2 space-y-6">
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
      </div>
    </div>
  );
};