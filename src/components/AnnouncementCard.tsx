import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-success text-success-foreground';
    }
  };

  return (
    <Card className="announcement-card border-l-4 border-l-warning">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Megaphone className="h-5 w-5 text-warning-foreground" />
            <CardTitle className="text-lg font-semibold text-warning-foreground">
              {announcement.title}
            </CardTitle>
          </div>
          <Badge className={getPriorityColor(announcement.priority)}>
            {announcement.priority.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center space-x-1 text-warning-foreground/80 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{new Date(announcement.date).toLocaleDateString('en-GB')}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-warning-foreground/90 leading-relaxed">
          {announcement.content}
        </p>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;