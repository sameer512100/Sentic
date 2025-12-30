import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IssueTypeIcon } from "@/components/ui/IssueTypeIcon";
import { Report, formatDate, getImageUrl } from "@/lib/api";
import { MapPin, Calendar, ImageIcon } from "lucide-react";

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
  showImage?: boolean;
}

export const ReportCard = ({ report, onClick, showImage = false }: ReportCardProps) => {
  const imageUrl = showImage ? getImageUrl(report) : null;

  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/20 overflow-hidden"
      onClick={onClick}
    >
      {showImage && imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt={`${report.issueType} report`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      {showImage && !imageUrl && (
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <IssueTypeIcon type={report.issueType} />
          <StatusBadge status={report.status} size="sm" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={report.severity} />
        </div>
        
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{report.location.area}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(report.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
