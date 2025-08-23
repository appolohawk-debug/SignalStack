import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Header from "@/components/header";
import TopNewsScroller from "@/components/top-news-scroller";
import NewsGrid from "@/components/news-grid";
import FilterTags from "@/components/filter-tags";
import Footer from "@/components/footer";
import type { NewsItem } from "@shared/schema";
import { Link, useLocation } from "wouter";

export default function Home() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("daily");
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFilters, setActiveFilters] = useState({
    companies: [] as string[],
    implementationTypes: [] as string[],
    relevanceCategories: [] as string[],
    industries: [] as string[]
  });

  const pageSize = 9;

  // Fetch filter options
  const { data: filterOptions } = useQuery({
    queryKey: ["/api/filters"],
    queryFn: async () => {
      const response = await fetch("/api/filters");
      return response.json();
    },
  });

  // Build query parameters for news
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (activeFilters.companies.length > 0) {
      activeFilters.companies.forEach(company => params.append('company', company));
    }
    if (activeFilters.implementationTypes.length > 0) {
      activeFilters.implementationTypes.forEach(type => params.append('implementationType', type));
    }
    if (activeFilters.relevanceCategories.length > 0) {
      params.append('relevanceCategories', activeFilters.relevanceCategories.join(','));
    }
    if (activeFilters.industries.length > 0) {
      activeFilters.industries.forEach(industry => params.append('industry', industry));
    }

    params.append('limit', String(pageSize * (currentPage + 1)));
    params.append('offset', '0');

    return params.toString();
  };

  // Fetch news items
  const { data: allNewsItems, isLoading, refetch } = useQuery<NewsItem[]>({
    queryKey: ["/api/news", activeFilters, currentPage],
    queryFn: async () => {
      const queryParams = buildQueryParams();
      const response = await fetch(`/api/news?${queryParams}`);
      return response.json();
    },
  });

  // Filter news items by search query on client side
  const filteredNewsItems = allNewsItems?.filter(item => 
    searchQuery === "" || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.company.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const hasMore = allNewsItems && allNewsItems.length === pageSize * (currentPage + 1);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleFilterChange = (type: keyof typeof activeFilters, value: string, checked: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }));
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handleRemoveFilter = (type: string, value: string) => {
    handleFilterChange(type as keyof typeof activeFilters, value, false);
  };

  const handleClearAllFilters = () => {
    setActiveFilters({
      companies: [],
      implementationTypes: [],
      relevanceCategories: [],
      industries: []
    });
    setCurrentPage(0);
  };

  const handleTabSwitch = (tab: string) => {
    if (tab === "PM Resources") {
      setLocation("/pm-resources");
      return;
    }
    setActiveTab(tab.toLowerCase());
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-signal-light">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <TopNewsScroller />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={activeTab === "daily" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabSwitch("daily")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "daily" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-signal-gray hover:text-gray-900"
              }`}
              data-testid="tab-daily"
            >
              Daily
            </Button>
            <Button
              variant={activeTab === "weekly" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabSwitch("weekly")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "weekly" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-signal-gray hover:text-gray-900"
              }`}
              data-testid="tab-weekly"
            >
              Weekly
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTabSwitch("PM Resources")}
              className="px-4 py-2 text-sm font-medium text-signal-gray hover:text-gray-900 rounded-md transition-colors"
              data-testid="tab-pm-resources"
            >
              PM Resources
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative md:hidden">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-48"
                data-testid="mobile-search-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-signal-gray h-4 w-4" />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2" data-testid="filters-button">
                  <Filter className="h-4 w-4 text-signal-gray" />
                  <span className="text-sm text-signal-gray">Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" data-testid="filters-dropdown">
                {filterOptions && (
                  <>
                    <DropdownMenuLabel>Companies</DropdownMenuLabel>
                    {filterOptions.news.companies.map((company: string) => (
                      <DropdownMenuCheckboxItem
                        key={company}
                        checked={activeFilters.companies.includes(company)}
                        onCheckedChange={(checked) => handleFilterChange('companies', company, checked)}
                        data-testid={`filter-option-company-${company}`}
                      >
                        {company}
                      </DropdownMenuCheckboxItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Implementation Type</DropdownMenuLabel>
                    {filterOptions.news.implementationTypes.map((type: string) => (
                      <DropdownMenuCheckboxItem
                        key={type}
                        checked={activeFilters.implementationTypes.includes(type)}
                        onCheckedChange={(checked) => handleFilterChange('implementationTypes', type, checked)}
                        data-testid={`filter-option-implementation-${type}`}
                      >
                        {type}
                      </DropdownMenuCheckboxItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Relevance Categories</DropdownMenuLabel>
                    {filterOptions.news.relevanceCategories.map((category: string) => (
                      <DropdownMenuCheckboxItem
                        key={category}
                        checked={activeFilters.relevanceCategories.includes(category)}
                        onCheckedChange={(checked) => handleFilterChange('relevanceCategories', category, checked)}
                        data-testid={`filter-option-relevance-${category}`}
                      >
                        {category}
                      </DropdownMenuCheckboxItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Industries</DropdownMenuLabel>
                    {filterOptions.news.industries.map((industry: string) => (
                      <DropdownMenuCheckboxItem
                        key={industry}
                        checked={activeFilters.industries.includes(industry)}
                        onCheckedChange={(checked) => handleFilterChange('industries', industry, checked)}
                        data-testid={`filter-option-industry-${industry}`}
                      >
                        {industry}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <FilterTags 
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
        />

        <NewsGrid 
          newsItems={filteredNewsItems}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore || false}
        />
      </main>

      <Footer />
    </div>
  );
}
