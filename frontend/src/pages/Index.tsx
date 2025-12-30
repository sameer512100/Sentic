import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Camera, 
  Brain, 
  BarChart3, 
  Shield, 
  ArrowRight,
  MapPin,
  Zap,
  Users
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: "Easy Reporting",
      description: "Snap a photo of any civic issue and submit it in seconds with location details.",
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Deep learning model identifies issue type and assigns severity scores automatically.",
    },
    {
      icon: BarChart3,
      title: "Priority Dashboard",
      description: "Issues ranked by severity for transparent, data-driven decision making.",
    },
    {
      icon: Shield,
      title: "Admin Control",
      description: "Protected admin panel for authorities to manage and resolve issues efficiently.",
    },
  ];

  const stats = [
    { value: "0-100", label: "Severity Score", icon: Zap },
    { value: "3+", label: "Issue Types", icon: MapPin },
    { value: "Real-time", label: "Updates", icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                AI-Powered Civic Monitoring
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Report Civic Issues,{" "}
                <span className="text-primary">Prioritize Action</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                SENTIC uses deep learning to analyze civic problems—potholes, garbage dumps, 
                fallen trees—and prioritize them by severity for faster resolution.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/report">
                  <Button size="lg" className="gap-2 text-base px-8">
                    Report an Issue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/reports">
                  <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                    View Reports
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-border bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-center gap-4 text-center animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-display font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From image upload to issue resolution, SENTIC streamlines the entire civic reporting process.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Card 
                  key={i} 
                  className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Improve Your Community?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join citizens who are making their neighborhoods safer and cleaner through data-driven reporting.
            </p>
            <Link to="/report">
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2 text-base px-8"
              >
                Start Reporting
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
