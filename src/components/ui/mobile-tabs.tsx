import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileTabsProps {
  tabs: {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  defaultValue: string;
  children: (activeTab: string) => React.ReactNode;
  className?: string;
}

export const MobileTabs = ({ tabs, defaultValue, children, className }: MobileTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  const currentTabIndex = tabs.findIndex(tab => tab.value === activeTab);
  const currentTab = tabs[currentTabIndex];

  const goToPrevious = () => {
    const prevIndex = currentTabIndex > 0 ? currentTabIndex - 1 : tabs.length - 1;
    setActiveTab(tabs[prevIndex].value);
  };

  const goToNext = () => {
    const nextIndex = currentTabIndex < tabs.length - 1 ? currentTabIndex + 1 : 0;
    setActiveTab(tabs[nextIndex].value);
  };

  if (!isMobile) {
    // Desktop fallback - render normal tabs
    return (
      <div className={className}>
        <div className="flex space-x-1 border-b mb-4">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.value}
                variant={activeTab === tab.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.value)}
                className="flex items-center gap-2"
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {tab.label}
              </Button>
            );
          })}
        </div>
        {children(activeTab)}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Mobile Tab Navigation */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToPrevious}
              className="mobile-touch-target"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 mx-2 mobile-touch-target">
                  {currentTab?.icon && <currentTab.icon className="w-4 h-4 mr-2" />}
                  {currentTab?.label}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Select View</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    return (
                      <Button
                        key={tab.value}
                        variant={activeTab === tab.value ? "default" : "outline"}
                        className="w-full mobile-button justify-start"
                        onClick={() => {
                          setActiveTab(tab.value);
                          setSheetOpen(false);
                        }}
                      >
                        {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                        {tab.label}
                      </Button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToNext}
              className="mobile-touch-target"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex space-x-1 mt-2">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index === currentTabIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Tab Content */}
      {children(activeTab)}
    </div>
  );
};