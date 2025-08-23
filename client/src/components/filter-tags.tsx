import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterTagsProps {
  activeFilters: {
    companies: string[];
    implementationTypes: string[];
    relevanceCategories: string[];
    industries: string[];
  };
  onRemoveFilter: (type: string, value: string) => void;
  onClearAllFilters: () => void;
}

export default function FilterTags({ activeFilters, onRemoveFilter, onClearAllFilters }: FilterTagsProps) {
  const hasActiveFilters = Object.values(activeFilters).some(filters => filters.length > 0);

  if (!hasActiveFilters) {
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge className="bg-signal-blue text-white text-xs font-medium">
          All Categories
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-signal-gray">Active filters:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAllFilters}
          className="text-xs text-signal-gray hover:text-gray-900"
          data-testid="clear-all-filters"
        >
          Clear all
        </Button>
      </div>
      
      {activeFilters.companies.map((company) => (
        <Badge
          key={`company-${company}`}
          variant="secondary"
          className="text-xs font-medium cursor-pointer hover:bg-gray-200 flex items-center gap-1"
          data-testid={`filter-company-${company}`}
        >
          {company}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter('companies', company)}
            className="h-3 w-3 p-0 hover:bg-transparent"
            data-testid={`remove-company-${company}`}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      ))}
      
      {activeFilters.implementationTypes.map((type) => (
        <Badge
          key={`implementation-${type}`}
          variant="secondary"
          className="text-xs font-medium cursor-pointer hover:bg-gray-200 flex items-center gap-1"
          data-testid={`filter-implementation-${type}`}
        >
          {type}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter('implementationTypes', type)}
            className="h-3 w-3 p-0 hover:bg-transparent"
            data-testid={`remove-implementation-${type}`}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      ))}
      
      {activeFilters.relevanceCategories.map((category) => (
        <Badge
          key={`relevance-${category}`}
          variant="secondary"
          className="text-xs font-medium cursor-pointer hover:bg-gray-200 flex items-center gap-1"
          data-testid={`filter-relevance-${category}`}
        >
          {category}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter('relevanceCategories', category)}
            className="h-3 w-3 p-0 hover:bg-transparent"
            data-testid={`remove-relevance-${category}`}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      ))}
      
      {activeFilters.industries.map((industry) => (
        <Badge
          key={`industry-${industry}`}
          variant="secondary"
          className="text-xs font-medium cursor-pointer hover:bg-gray-200 flex items-center gap-1"
          data-testid={`filter-industry-${industry}`}
        >
          {industry}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter('industries', industry)}
            className="h-3 w-3 p-0 hover:bg-transparent"
            data-testid={`remove-industry-${industry}`}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      ))}
    </div>
  );
}
