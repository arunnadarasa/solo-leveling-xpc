import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Calendar, User } from 'lucide-react';
import { PatientSearch } from './PatientSearch';
import { Patient } from './PatientDashboard';

interface PatientListProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
  getRiskColor: (level: string) => string;
}

export const PatientList = ({ patients, selectedPatient, onSelectPatient, getRiskColor }: PatientListProps) => {
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);

  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  // Sort filtered patients by risk score (highest first)
  const sortedPatients = [...filteredPatients].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <Card className="h-[800px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          Patient List ({filteredPatients.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <PatientSearch 
          patients={patients} 
          onFilteredPatientsChange={setFilteredPatients} 
        />
        <ScrollArea className="h-[600px] px-4">
          <div className="space-y-3">
            {sortedPatients.map((patient) => (
              <div
                key={patient.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedPatient?.id === patient.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onSelectPatient(patient)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{patient.name}</h3>
                    <p className="text-xs text-muted-foreground">Age {patient.age} • {patient.mrn}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {patient.alerts > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {patient.alerts}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    className={`text-xs bg-${getRiskColor(patient.riskLevel)} text-${getRiskColor(patient.riskLevel)}-foreground`}
                  >
                    {patient.riskLevel.toUpperCase()} RISK
                  </Badge>
                  <span className="text-sm font-medium">Score: {patient.riskScore}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                  </div>
                  {patient.nextAppointment && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <div className="text-xs text-muted-foreground mb-1">Conditions:</div>
                  <div className="flex flex-wrap gap-1">
                    {patient.conditions.slice(0, 2).map((condition, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                    {patient.conditions.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{patient.conditions.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};