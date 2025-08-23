import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [location] = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-signal-blue transition-colors" data-testid="logo-link">
                <span className="text-signal-blue">Signal</span>Stack
              </Link>
            </div>
            <div className="hidden md:block ml-6">
              <span className="text-sm text-signal-gray">Daily AI Tracker</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search AI news..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 w-64"
                data-testid="search-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-signal-gray h-4 w-4" />
            </div>
            
            <Button variant="ghost" size="sm" className="p-2" data-testid="search-button-mobile">
              <Search className="h-5 w-5 text-signal-gray" />
            </Button>
            
            <Button variant="ghost" size="sm" className="p-2" data-testid="notifications-button">
              <Bell className="h-5 w-5 text-signal-gray" />
            </Button>
            
            <Button className="bg-signal-blue text-white hover:bg-blue-600" data-testid="subscribe-button">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
