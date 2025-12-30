import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IssueTypeIcon } from "@/components/ui/IssueTypeIcon";
import { ReportModal } from "@/components/reports/ReportModal";
import { useToast } from "@/hooks/use-toast";
import { api, Report, removeToken, isAuthenticated, formatDate } from "@/lib/api";
import { 
  Loader2, 
  Search, 
  RefreshCw, 
  MapPin, 
  LogOut,
  AlertTriangle,
  CheckCircle,
  Clock,
  ImageIcon
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    fetchReports();
  }, [navigate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.getAdminReports();
      setReports(response.data);
    } catch (error) {
      if (error instanceof Error && error.message === 'Session expired') {
        navigate("/admin/login");
      }
      toast({
        title: "Failed to load reports",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: 'open' | 'resolved' | 'flagged') => {
    setUpdatingId(reportId);
    try {
      await api.updateReportStatus(reportId, newStatus);
      setReports(prev => 
        prev.map(r => r._id === reportId ? { ...r, status: newStatus } : r)
      );
      toast({
        title: "Status updated",
        description: `Report marked as ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate("/admin/login");
    toast({
      title: "Logged out",
      description: "You have been signed out.",
    });
  };

  const stats = useMemo(() => ({
    total: reports.length,
    open: reports.filter(r => r.status === 'open').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    flagged: reports.filter(r => r.status === 'flagged').length,
    highSeverity: reports.filter(r => r.severity >= 70).length,
  }), [reports]);

  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.location.area.toLowerCase().includes(query) ||
        r.issueType.toLowerCase().includes(query) ||
        r.reporter?.name?.toLowerCase().includes(query) ||
        r.reporter?.phone?.includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(r => r.issueType === typeFilter);
    }

    return filtered.sort((a, b) => b.severity - a.severity);
  }, [reports, searchQuery, statusFilter, typeFilter]);

  const getImageUrl = (report: Report): string | null => {
    if (report.imageData && report.imageMimeType) {
      return `data:${report.imageMimeType};base64,${report.imageData}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl">SENTIC</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium ml-2">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchReports} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
              <Clock className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Severity</CardTitle>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.highSeverity}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by location, type, or reporter..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
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
        </div>

        {/* Reports Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No reports found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Image</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => {
                      const imageUrl = getImageUrl(report);
                      return (
                        <TableRow 
                          key={report._id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedReport(report);
                            setModalOpen(true);
                          }}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            {imageUrl ? (
                              <img 
                                src={imageUrl} 
                                alt="" 
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <IssueTypeIcon type={report.issueType} size="sm" />
                          </TableCell>
                          <TableCell>
                            <SeverityBadge severity={report.severity} size="sm" />
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">
                            {report.location.area}
                          </TableCell>
                          <TableCell>
                            {report.reporter ? (
                              <div className="text-sm">
                                <div className="font-medium">{report.reporter.name}</div>
                                <div className="text-muted-foreground text-xs">{report.reporter.phone}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(report.createdAt)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={report.status} size="sm" />
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <Select 
                              value={report.status} 
                              onValueChange={(value: 'open' | 'resolved' | 'flagged') => 
                                handleStatusChange(report._id, value)
                              }
                              disabled={updatingId === report._id}
                            >
                              <SelectTrigger className="w-[110px] h-8 text-xs">
                                {updatingId === report._id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <SelectValue />
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="flagged">Flagged</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <ReportModal 
        report={selectedReport}
        open={modalOpen}
        onOpenChange={setModalOpen}
        showReporterInfo={true}
      />
    </div>
  );
};

export default AdminDashboard;
