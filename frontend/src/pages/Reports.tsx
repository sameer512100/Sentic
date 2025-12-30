import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReportCard } from "@/components/reports/ReportCard";
import { ReportModal } from "@/components/reports/ReportModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, Report } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, SlidersHorizontal, RefreshCw } from "lucide-react";

const Reports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("severity");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.getReports();
      setReports(response.data);
    } catch (error) {
      toast({
        title: "Failed to load reports",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportClick = async (report: Report) => {
    try {
      const response = await api.getReport(report._id);
      setSelectedReport(response.data);
      setModalOpen(true);
    } catch (error) {
      toast({
        title: "Failed to load report details",
        variant: "destructive",
      });
    }
  };

  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.location.area.toLowerCase().includes(query) ||
        r.issueType.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(r => r.issueType === typeFilter);
    }

    // Sort
    if (sortBy === "severity") {
      filtered.sort((a, b) => b.severity - a.severity);
    } else if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [reports, searchQuery, statusFilter, typeFilter, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Public Reports</h1>
              <p className="text-muted-foreground">
                {reports.length} civic issues reported and tracked
              </p>
            </div>
            <Button variant="outline" onClick={fetchReports} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by location or type..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Issue Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pothole">Pothole</SelectItem>
                  <SelectItem value="garbage">Garbage</SelectItem>
                  <SelectItem value="tree_fall">Fallen Tree</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="severity">Severity (High)</SelectItem>
                  <SelectItem value="date">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reports Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                {reports.length === 0 
                  ? "No reports yet. Be the first to report an issue!"
                  : "No reports match your filters."}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredReports.map((report, i) => (
                <div 
                  key={report._id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <ReportCard 
                    report={report} 
                    onClick={() => handleReportClick(report)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      <ReportModal 
        report={selectedReport}
        open={modalOpen}
        onOpenChange={setModalOpen}
        showReporterInfo={false}
      />
    </div>
  );
};

export default Reports;
