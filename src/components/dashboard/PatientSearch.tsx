import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { Patient } from './PatientDashboard';

interface PatientSearchProps {
  patients: Patient[];
  onFilteredPatientsChange: (patients: Patient[]) => void;
}

export const PatientSearch = ({ patients, onFilteredPatientsChange }: PatientSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPatients(query, riskFilter);
  };

  const handleRiskFilter = (risk: string) => {
    const newFilter = riskFilter.includes(risk) 
      ? riskFilter.filter(r => r !== risk)
      : [...riskFilter, risk];
    
    setRiskFilter(newFilter);
    filterPatients(searchQuery, newFilter);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRiskFilter([]);
    onFilteredPatientsChange(patients);
  };

  const filterPatients = (query: string, risks: string[]) => {
    let filtered = patients;

    // Text search
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(lowercaseQuery) ||
        patient.mrn.toLowerCase().includes(lowercaseQuery) ||
        patient.conditions.some(condition => 
          condition.toLowerCase().includes(lowercaseQuery)
        )
      );
    }

    // Risk level filter
    if (risks.length > 0) {
      filtered = filtered.filter(patient => risks.includes(patient.riskLevel));
    }

    onFilteredPatientsChange(filtered);
  };

  const riskLevels = ['critical', 'high', 'medium', 'low'];
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-critical text-critical-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-info text-info-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const activeFiltersCount = riskFilter.length + (searchQuery.trim() ? 1 : 0);

  return (
    <div className="space-y-3 p-4 border-b">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by name, MRN, or condition..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Risk Level:</p>
          <div className="flex flex-wrap gap-2">
            {riskLevels.map((risk) => (
              <Badge
                key={risk}
                variant={riskFilter.includes(risk) ? "default" : "outline"}
                className={`cursor-pointer capitalize ${
                  riskFilter.includes(risk) ? getRiskColor(risk) : ''
                }`}
                onClick={() => handleRiskFilter(risk)}
              >
                {risk}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {patients.length} patients
        {activeFiltersCount > 0 && ` (filtered from ${patients.length} total)`}
      </div>
    </div>
  );
};