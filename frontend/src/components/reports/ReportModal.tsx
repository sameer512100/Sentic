import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IssueTypeIcon } from "@/components/ui/IssueTypeIcon";
import { Report, formatDate, getImageUrl } from "@/lib/api";
import { MapPin, Calendar, ImageIcon, User, Phone } from "lucide-react";

interface ReportModalProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showReporterInfo?: boolean;
}

export const ReportModal = ({ report, open, onOpenChange, showReporterInfo = false }: ReportModalProps) => {
  if (!report) return null;

  const imageUrl = getImageUrl(report);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <IssueTypeIcon type={report.issueType} size="lg" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {imageUrl ? (
            <div className="rounded-lg overflow-hidden bg-muted aspect-video">
              <img 
                src={imageUrl} 
                alt={`${report.issueType} report`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-lg bg-muted aspect-video flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground/40" />
            </div>
          )}

          {/* Status & Severity */}
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={report.status} />
            <SeverityBadge severity={report.severity} size="lg" />
          </div>

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{report.location.area}</span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Reported</p>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formatDate(report.createdAt)}</span>
              </div>
            </div>

            {showReporterInfo && report.reporter && (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Reporter Name</p>
                  <div className="flex items-center gap-2 text-foreground">
                    <User className="w-4 h-4 text-primary" />
                    <span>{report.reporter.name}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Reporter Phone</p>
                  <div className="flex items-center gap-2 text-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{report.reporter.phone}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-xs text-muted-foreground border-t border-border pt-4">
            Report ID: {report._id}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
