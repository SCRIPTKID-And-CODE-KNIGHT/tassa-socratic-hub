import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar, Megaphone, Clock } from 'lucide-react';
import AnnouncementCard from '@/components/AnnouncementCard';
import { supabase } from '@/integrations/supabase/client';

const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  const [allAnnouncements, setAllAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        date: new Date(announcement.created_at).toISOString().split('T')[0],
        priority: announcement.priority as 'high' | 'medium' | 'low'
      })) || [];
      
      setAllAnnouncements(formattedData);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Fallback to static data if database fails
      setAllAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

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
          {isLoading ? (
            <div className="text-center py-8">Loading announcements...</div>
          ) : filteredAnnouncements.length > 0 ? (
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
                    : 'No published announcements available at the moment.'}
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