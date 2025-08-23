import { Twitter, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <span className="text-signal-blue">Signal</span>Stack
            </h3>
            <p className="text-signal-gray mb-6 max-w-md">
              Stay ahead of the AI revolution with curated news, insights, and resources for Product Managers and AI enthusiasts.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-signal-gray hover:text-gray-900" data-testid="twitter-link">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-signal-gray hover:text-gray-900" data-testid="linkedin-link">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-signal-gray hover:text-gray-900" data-testid="github-link">
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-signal-gray">
              <li><Link href="/" className="hover:text-gray-900 transition-colors" data-testid="footer-daily-tracker">Daily Tracker</Link></li>
              <li><Link href="/pm-resources" className="hover:text-gray-900 transition-colors" data-testid="footer-pm-resources">PM Resources</Link></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors" data-testid="footer-api-access">API Access</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors" data-testid="footer-newsletter">Newsletter</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-signal-gray">
              <li><a href="#" className="hover:text-gray-900 transition-colors" data-testid="footer-about">About</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors" data-testid="footer-privacy">Privacy</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors" data-testid="footer-terms">Terms</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors" data-testid="footer-contact">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-signal-gray">
          <p>&copy; 2024 SignalStack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
