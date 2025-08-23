import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, Download, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { PmResource } from "@shared/schema";
import { Link } from "wouter";

export default function PmResources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedResourceType, setSelectedResourceType] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Fetch filter options
  const { data: filterOptions } = useQuery({
    queryKey: ["/api/filters"],
    queryFn: async () => {
      const response = await fetch("/api/filters");
      return response.json();
    },
  });

  // Build query parameters for PM resources
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (selectedStage !== "all") {
      params.append('pmStage', selectedStage);
    }
    if (selectedResourceType !== "all") {
      params.append('resourceType', selectedResourceType);
    }
    if (selectedCompany !== "all") {
      params.append('company', selectedCompany);
    }
    if (selectedDifficulty !== "all") {
      params.append('difficulty', selectedDifficulty);
    }

    return params.toString();
  };

  // Fetch PM resources
  const { data: allResources, isLoading } = useQuery<PmResource[]>({
    queryKey: ["/api/pm-resources", selectedStage, selectedResourceType, selectedCompany, selectedDifficulty],
    queryFn: async () => {
      const queryParams = buildQueryParams();
      const response = await fetch(`/api/pm-resources?${queryParams}`);
      return response.json();
    },
  });

  // Filter resources by search query on client side
  const filteredResources = allResources?.filter(resource => 
    searchQuery === "" || 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  // Group resources by PM stage
  const resourcesByStage = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.pmStage]) {
      acc[resource.pmStage] = [];
    }
    acc[resource.pmStage].push(resource);
    return acc;
  }, {} as Record<string, PmResource[]>);

  const pmStages = [
    "Discovery",
    "Planning", 
    "Execution",
    "Launch",
    "Growth",
    "Optimization"
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-600';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-600';
      case 'advanced':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'template':
        return '📋';
      case 'case study':
        return '📊';
      case 'product teardown':
        return '🔍';
      case 'interview questions':
        return '❓';
      case 'tools':
        return '🛠️';
      case 'frameworks':
        return '🏗️';
      case 'study guides':
        return '📚';
      case 'ai prompts':
        return '🤖';
      default:
        return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-signal-light">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-signal-gray hover:text-gray-900 mr-4" data-testid="back-to-home">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to News
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PM Resources</h1>
            <p className="text-signal-gray mt-1">Curated resources for Product Managers working with AI</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={selectedStage === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedStage("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedStage === "all" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-signal-gray hover:text-gray-900"
              }`}
              data-testid="stage-filter-all"
            >
              All Stages
            </Button>
            {pmStages.map((stage) => (
              <Button
                key={stage}
                variant={selectedStage === stage ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedStage(stage)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedStage === stage 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-signal-gray hover:text-gray-900"
                }`}
                data-testid={`stage-filter-${stage}`}
              >
                {stage}
              </Button>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" data-testid="resource-type-filter">
                {selectedResourceType === "all" ? "All Types" : selectedResourceType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={selectedResourceType === "all"}
                onCheckedChange={() => setSelectedResourceType("all")}
              >
                All Types
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {filterOptions?.pmResources.resourceTypes.map((type: string) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedResourceType === type}
                  onCheckedChange={() => setSelectedResourceType(type)}
                  data-testid={`resource-type-${type}`}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" data-testid="company-filter">
                {selectedCompany === "all" ? "All Companies" : selectedCompany}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={selectedCompany === "all"}
                onCheckedChange={() => setSelectedCompany("all")}
              >
                All Companies
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {filterOptions?.pmResources.resourceTypes.filter((type: string) => type === "Interview Questions").length > 0 && (
                <>
                  <DropdownMenuCheckboxItem
                    checked={selectedCompany === "OpenAI"}
                    onCheckedChange={() => setSelectedCompany("OpenAI")}
                    data-testid="company-openai"
                  >
                    OpenAI
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedCompany === "Google"}
                    onCheckedChange={() => setSelectedCompany("Google")}
                    data-testid="company-google"
                  >
                    Google
                  </DropdownMenuCheckboxItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" data-testid="difficulty-filter">
                {selectedDifficulty === "all" ? "All Levels" : selectedDifficulty}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={selectedDifficulty === "all"}
                onCheckedChange={() => setSelectedDifficulty("all")}
              >
                All Levels
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {filterOptions?.pmResources.difficulties.map((difficulty: string) => (
                <DropdownMenuCheckboxItem
                  key={difficulty}
                  checked={selectedDifficulty === difficulty}
                  onCheckedChange={() => setSelectedDifficulty(difficulty)}
                  data-testid={`difficulty-${difficulty}`}
                >
                  {difficulty}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-48 animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : selectedStage === "all" ? (
          <div className="space-y-12">
            {pmStages.map((stage) => {
              const stageResources = resourcesByStage[stage] || [];
              if (stageResources.length === 0) return null;

              return (
                <div key={stage}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{stage}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stageResources.map((resource) => (
                      <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300" data-testid={`resource-card-${resource.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{getResourceTypeIcon(resource.resourceType)}</span>
                              <Badge variant="secondary" className="text-xs">
                                {resource.resourceType}
                              </Badge>
                            </div>
                            <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                              {resource.difficulty}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {resource.title}
                          </h3>

                          <p className="text-sm text-signal-gray mb-4 line-clamp-3">
                            {resource.description}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {resource.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            {resource.company && (
                              <Badge variant="secondary" className="text-xs">
                                {resource.company}
                              </Badge>
                            )}
                            <div className="flex space-x-2">
                              {resource.downloadUrl && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => resource.downloadUrl && window.open(resource.downloadUrl, '_blank')}
                                  data-testid={`download-${resource.id}`}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              {resource.resourceUrl && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => resource.resourceUrl && window.open(resource.resourceUrl, '_blank')}
                                  data-testid={`view-${resource.id}`}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300" data-testid={`resource-card-${resource.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getResourceTypeIcon(resource.resourceType)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {resource.resourceType}
                      </Badge>
                    </div>
                    <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>

                  <p className="text-sm text-signal-gray mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    {resource.company && (
                      <Badge variant="secondary" className="text-xs">
                        {resource.company}
                      </Badge>
                    )}
                    <div className="flex space-x-2">
                      {resource.downloadUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => resource.downloadUrl && window.open(resource.downloadUrl, '_blank')}
                          data-testid={`download-${resource.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {resource.resourceUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => resource.resourceUrl && window.open(resource.resourceUrl, '_blank')}
                          data-testid={`view-${resource.id}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredResources.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-signal-gray">Try adjusting your filters or search query.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
