import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, Zap, Database, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface DemoControlsProps {
  onRunAnalysis: (type: 'phenoml' | 'metriport') => void;
  isAnalyzing: boolean;
  selectedPatient: any;
}

export const DemoControls = ({ onRunAnalysis, isAnalyzing, selectedPatient }: DemoControlsProps) => {
  const [demoMode, setDemoMode] = useState<'live' | 'presentation'>('live');

  const demoFeatures = [
    {
      title: 'PhenoML AI Risk Assessment',
      description: 'Real-time patient risk stratification using advanced machine learning',
      icon: Brain,
      color: 'primary',
      action: () => onRunAnalysis('phenoml'),
      tags: ['AI-Powered', 'Real-time', 'Risk Scoring']
    },
    {
      title: 'Metriport Health Data Integration',
      description: 'Comprehensive patient health records from multiple sources',
      icon: Database,
      color: 'info',
      action: () => onRunAnalysis('metriport'),
      tags: ['Interoperability', 'FHIR', 'Comprehensive']
    },
    {
      title: 'Predictive Analytics',
      description: 'Early warning system for potential health deterioration',
      icon: TrendingUp,
      color: 'warning',
      action: () => console.log('Coming soon'),
      tags: ['Predictive', 'Early Warning', 'ML']
    },
    {
      title: 'Care Team Coordination',
      description: 'Automated workflow recommendations for care teams',
      icon: Users,
      color: 'success',
      action: () => console.log('Coming soon'),
      tags: ['Workflow', 'Collaboration', 'Automation']
    }
  ];

  return (
    <div className="space-y-4">
      {/* Demo Mode Toggle */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary" />
            XPC Hackathon Demo Controls
          </CardTitle>
          <CardDescription>
            Clinical Decision Support Enhancer - Live AI Analysis Demo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="space-x-2">
              <Button 
                variant={demoMode === 'live' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setDemoMode('live')}
              >
                Live Demo
              </Button>
              <Button 
                variant={demoMode === 'presentation' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setDemoMode('presentation')}
              >
                Presentation Mode
              </Button>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success">
              Ready for Demo
            </Badge>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              const isDisabled = !selectedPatient || isAnalyzing || 
                (feature.title.includes('Predictive') || feature.title.includes('Care Team'));
              
              return (
                <Card key={index} className={`border-${feature.color}/20 hover:border-${feature.color}/40 transition-colors`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <IconComponent className={`w-5 h-5 text-${feature.color}`} />
                      {(feature.title.includes('PhenoML') || feature.title.includes('Metriport')) && (
                        <Badge variant="outline" className="text-xs">
                          Integrated
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {feature.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={feature.action}
                      disabled={isDisabled}
                    >
                      {isAnalyzing && (feature.title.includes('PhenoML') || feature.title.includes('Metriport')) 
                        ? 'Processing...' 
                        : feature.title.includes('Predictive') || feature.title.includes('Care Team')
                          ? 'Coming Soon'
                          : 'Run Analysis'
                      }
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Demo Instructions */}
          <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
            <h4 className="font-medium text-info mb-2">Demo Instructions:</h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Select a patient from the list on the left</li>
              <li>2. Click "Run PhenoML Analysis" to see AI-powered risk assessment</li>
              <li>3. Click "Metriport Integration" to simulate comprehensive health data analysis</li>
              <li>4. Observe real-time risk score updates and clinical recommendations</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Real-time Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">94%</div>
              <div className="text-xs text-muted-foreground">AI Accuracy</div>
            </div>
            <div>
              <div className="text-lg font-bold text-warning">2.3s</div>
              <div className="text-xs text-muted-foreground">Avg Analysis</div>
            </div>
            <div>
              <div className="text-lg font-bold text-success">24/7</div>
              <div className="text-xs text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};