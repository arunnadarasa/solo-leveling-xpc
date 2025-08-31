import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Patient } from './PatientDashboard';

interface RiskVisualizationProps {
  patient: Patient;
}

export const RiskVisualization = ({ patient }: RiskVisualizationProps) => {
  const riskFactors = [
    {
      name: 'Cardiovascular Risk',
      score: 85,
      trend: 'up',
      impact: 'high',
      details: 'Elevated BP, family history'
    },
    {
      name: 'Diabetes Progression',
      score: 72,
      trend: 'stable',
      impact: 'medium',
      details: 'HbA1c trending upward'
    },
    {
      name: 'Medication Adherence',
      score: 45,
      trend: 'down',
      impact: 'high',
      details: 'Missed doses detected'
    },
    {
      name: 'Lifestyle Factors',
      score: 65,
      trend: 'up',
      impact: 'medium',
      details: 'Diet and exercise compliance'
    }
  ];

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'info';
    return 'success';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-critical" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-success" />;
      default:
        return <CheckCircle className="w-4 h-4 text-info" />;
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center glow-text">
          <AlertTriangle className="w-5 h-5 mr-2 text-warning animate-pulse" />
          Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="text-center p-6 glass-medium rounded-lg animate-scale-in">
          <div className="text-3xl font-bold text-critical mb-2 glow-text">{patient.riskScore}</div>
          <div className="text-sm text-muted-foreground">Overall Risk Score</div>
          <Progress value={patient.riskScore} className="mt-3 glass-progress" />
        </div>

        {/* Risk Factor Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Risk Factor Analysis</h3>
          {riskFactors.map((factor, index) => (
            <div key={index} className="space-y-2 glass-light p-3 rounded-lg hover-scale animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{factor.name}</span>
                  {getTrendIcon(factor.trend)}
                  <Badge 
                    variant={factor.impact === 'high' ? 'destructive' : factor.impact === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {factor.impact.toUpperCase()}
                  </Badge>
                </div>
                <span className="font-semibold">{factor.score}</span>
              </div>
              <Progress 
                value={factor.score} 
                className={`h-2 bg-muted [&>div]:bg-${getProgressColor(factor.score)}`}
              />
              <p className="text-sm text-muted-foreground">{factor.details}</p>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="mt-6 p-4 glass-glow rounded-lg border border-info/20 animate-fade-in">
          <h3 className="font-semibold text-info mb-2 glow-text">AI Recommendations</h3>
          <ul className="space-y-1 text-sm">
            <li className="animate-fade-in animation-delay-100">• Immediate cardiology consultation recommended</li>
            <li className="animate-fade-in animation-delay-200">• Adjust BP medication dosage</li>
            <li className="animate-fade-in animation-delay-300">• Schedule diabetes educator appointment</li>
            <li className="animate-fade-in animation-delay-400">• Implement medication adherence monitoring</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};