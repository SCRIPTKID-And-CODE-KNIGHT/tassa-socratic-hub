import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar, Megaphone, Clock } from 'lucide-react';
import AnnouncementCard from '@/components/AnnouncementCard';

const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  // Sample announcements data
  const allAnnouncements = [
    {
      id: '1',
      title: 'Registration Open for 2024 Socratic Series',
      content: 'We are pleased to announce that registration is now open for the 2024 Tanzania Socratic Series. All secondary schools are invited to participate in this prestigious academic competition. The series will cover multiple subjects with special emphasis on Geography, History, and Social Sciences. Registration deadline is March 31st, 2024.',
      date: '2024-01-15',
      priority: 'high' as const
    },
    {
      id: '2',
      title: 'Geography Focus for March Series',
      content: 'The upcoming March series will focus primarily on Physical and Human Geography. Schools should prepare their students accordingly. Recommended study materials and past papers are available on our resources page.',
      date: '2024-01-10',
      priority: 'medium' as const
    },
    {
      id: '3',
      title: 'New Results Portal Features',
      content: 'We have updated our results portal with new features including downloadable PDF reports, detailed analytics, and improved search functionality. All schools can now access comprehensive performance reports.',
      date: '2024-01-08',
      priority: 'low' as const
    },
    {
      id: '4',
      title: 'Participation Confirmation Deadline',
      content: 'All registered schools must confirm their participation for the upcoming April series by March 15th, 2024. Use the participation confirmation page on our website.',
      date: '2024-01-05',
      priority: 'high' as const
    },
    {
      id: '5',
      title: 'Study Materials Update',
      content: 'New study materials for the 2024 series are now available. The materials include updated geography textbook references, sample questions, and detailed syllabi for all subjects.',
      date: '2024-01-03',
      priority: 'medium' as const
    },
    {
      id: '6',
      title: 'Regional Coordinators Appointment',
      content: 'We are pleased to announce the appointment of new regional coordinators for Mwanza, Arusha, and Dodoma regions. Contact details will be shared with registered schools in these regions.',
      date: '2024-01-01',
      priority: 'low' as const
    }
  ];

  const filteredAnnouncements = allAnnouncements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || announcement.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityCount = (priority: string) => {
    if (priority === 'all') return allAnnouncements.length;
    return allAnnouncements.filter(a => a.priority === priority).length;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            TASSA Announcements
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest news, updates, and important information from 
            Tanzania Socratic Series Association.
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority ({getPriorityCount('all')})</SelectItem>
                    <SelectItem value="high">High Priority ({getPriorityCount('high')})</SelectItem>
                    <SelectItem value="medium">Medium Priority ({getPriorityCount('medium')})</SelectItem>
                    <SelectItem value="low">Low Priority ({getPriorityCount('low')})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Legend */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <Badge className="bg-destructive text-destructive-foreground">HIGH</Badge>
              <span className="text-sm text-muted-foreground">Urgent - Action Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-warning text-warning-foreground">MEDIUM</Badge>
              <span className="text-sm text-muted-foreground">Important - Please Note</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-success text-success-foreground">LOW</Badge>
              <span className="text-sm text-muted-foreground">Informational</span>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No announcements found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterPriority !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No announcements available at the moment.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Subscription Notice */}
        <Card className="mt-12 border-primary/20 bg-primary-light/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-primary mb-2 flex items-center justify-center">
                <Clock className="h-5 w-5 mr-2" />
                Stay Updated
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Want to receive announcements directly? Register your school to get notifications 
                about important updates and upcoming series.
              </p>
              <Button variant="outline" size="sm">
                Register for Updates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementsPage;