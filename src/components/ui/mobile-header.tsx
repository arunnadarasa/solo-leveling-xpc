import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertTriangle, Brain, Activity, RefreshCw, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileHeaderProps {
  totalAlerts: number;
  isAnalyzing: boolean;
  loading: boolean;
  selectedPatient: any;
  onRunPhenoML: () => void;
  onRunMetriport: () => void;
  onRefresh: () => void;
}

export const MobileHeader = ({
  totalAlerts,
  isAnalyzing,
  loading,
  selectedPatient,
  onRunPhenoML,
  onRunMetriport,
  onRefresh
}: MobileHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
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
            onClick={onRunPhenoML}
            disabled={isAnalyzing || !selectedPatient}
          >
            <Brain className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Run PhenoML Analysis'}
          </Button>
          <Button 
            variant="outline" 
            onClick={onRunMetriport}
            disabled={isAnalyzing || !selectedPatient}
          >
            <Activity className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Processing...' : 'Metriport Integration'}
          </Button>
          <Button variant="outline" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-background border-b px-4 py-3 sticky top-0 z-40">
      <div className="flex-1 min-w-0">
        <h1 className="mobile-header-responsive truncate">Clinical Decision Support</h1>
        <Badge variant="destructive" className="bg-critical text-critical-foreground mt-1">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {totalAlerts} Alerts
        </Badge>
      </div>
      
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="mobile-touch-target">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Actions</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <Button 
              className="w-full mobile-button" 
              variant="outline"
              onClick={() => {
                onRunPhenoML();
                setMenuOpen(false);
              }}
              disabled={isAnalyzing || !selectedPatient}
            >
              <Brain className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Run PhenoML Analysis'}
            </Button>
            <Button 
              className="w-full mobile-button"
              variant="outline"
              onClick={() => {
                onRunMetriport();
                setMenuOpen(false);
              }}
              disabled={isAnalyzing || !selectedPatient}
            >
              <Activity className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Processing...' : 'Metriport Integration'}
            </Button>
            <Button 
              className="w-full mobile-button"
              variant="outline" 
              onClick={() => {
                onRefresh();
                setMenuOpen(false);
              }} 
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            {!selectedPatient && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Select a patient to enable AI analysis features
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};