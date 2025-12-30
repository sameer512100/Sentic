import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg">SENTIC</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              A civic-issue reporting and prioritization platform designed to improve 
              public infrastructure monitoring through AI-powered analysis.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link to="/reports" className="hover:text-foreground transition-colors">View Reports</Link>
              <Link to="/report" className="hover:text-foreground transition-colors">Report Issue</Link>
            </nav>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Admin</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/admin/login" className="hover:text-foreground transition-colors">Admin Login</Link>
            </nav>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SENTIC. Building better communities through technology.</p>
        </div>
      </div>
    </footer>
  );
};
