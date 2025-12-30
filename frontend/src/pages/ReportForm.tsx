import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ImageUpload } from "@/components/reports/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api, Report, getIssueTypeLabel } from "@/lib/api";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Loader2, MapPin, CheckCircle, Navigation } from "lucide-react";

const ReportForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [image, setImage] = useState<File | null>(null);
  const [area, setArea] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [success, setSuccess] = useState<Report | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive",
      });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setLocating(false);
        toast({
          title: "Location detected",
          description: "GPS coordinates have been filled in.",
        });
      },
      (error) => {
        setLocating(false);
        toast({
          title: "Location error",
          description: error.message,
          variant: "destructive",
        });
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      toast({
        title: "Image required",
        description: "Please upload an image of the issue.",
        variant: "destructive",
      });
      return;
    }

    if (!area || !latitude || !longitude) {
      toast({
        title: "Location required",
        description: "Please provide the area and GPS coordinates.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("area", area);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      if (name) formData.append("name", name);
      if (phone) formData.append("phone", phone);

      const response = await api.createReport(formData);
      setSuccess(response.data);
      
      toast({
        title: "Report submitted!",
        description: "Your civic issue has been reported successfully.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-lg">
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Report Submitted!</CardTitle>
                <CardDescription>
                  Our AI has analyzed your image and classified the issue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Issue Type</span>
                    <span className="font-medium">{getIssueTypeLabel(success.issueType)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Severity</span>
                    <SeverityBadge severity={success.severity} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="font-medium">{success.location.area}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSuccess(null);
                      setImage(null);
                      setArea("");
                      setLatitude("");
                      setLongitude("");
                      setName("");
                      setPhone("");
                    }}
                  >
                    Report Another
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => navigate("/reports")}
                  >
                    View All Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Report a Civic Issue</h1>
            <p className="text-muted-foreground">
              Upload a photo and we'll analyze it using AI to determine the issue type and severity.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Issue Photo *</Label>
                  <ImageUpload onFileSelect={setImage} />
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Location Details *</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={detectLocation}
                      disabled={locating}
                    >
                      {locating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4 mr-2" />
                      )}
                      Detect Location
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Area / Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="area"
                        placeholder="e.g., Downtown Brooklyn, Main Street"
                        className="pl-10"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input 
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="40.7128"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input 
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="-74.0060"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Reporter Info (Optional) */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <Label className="text-muted-foreground">Contact Information (Optional)</Label>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        placeholder="+1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing & Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportForm;
