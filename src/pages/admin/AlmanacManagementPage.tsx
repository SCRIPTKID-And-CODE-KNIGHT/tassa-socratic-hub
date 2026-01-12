import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Calendar, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AlmanacEvent {
  id: string;
  series_number: number;
  event_date: string;
  event_name: string;
  responsible_person: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

const eventSuggestions = [
  'Examination Day',
  'Exam Setting',
  'Marking',
  'Releasing of Exam Date',
  'Submission of Constructed Exam to Coordinator',
  'Exam Moderation After Setting',
  'Results Release',
  'Registration Deadline',
  'Payment Deadline',
];

const AlmanacManagementPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<AlmanacEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AlmanacEvent | null>(null);
  const [activeTab, setActiveTab] = useState('5');
  
  const [formData, setFormData] = useState({
    series_number: 5,
    event_date: '',
    event_name: '',
    responsible_person: '',
    description: '',
    is_published: false,
  });

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      navigate('/');
      toast({ title: 'Access Denied', description: 'Admin access required', variant: 'destructive' });
      return;
    }

    fetchEvents();
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('almanac_events')
      .select('*')
      .order('event_date', { ascending: true });

    if (data && !error) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      const { error } = await supabase
        .from('almanac_events')
        .update({
          series_number: formData.series_number,
          event_date: formData.event_date,
          event_name: formData.event_name,
          responsible_person: formData.responsible_person,
          description: formData.description || null,
          is_published: formData.is_published,
        })
        .eq('id', editingEvent.id);

      if (error) {
        toast({ title: 'Error', description: 'Failed to update event', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Event updated successfully' });
        fetchEvents();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('almanac_events')
        .insert({
          series_number: formData.series_number,
          event_date: formData.event_date,
          event_name: formData.event_name,
          responsible_person: formData.responsible_person,
          description: formData.description || null,
          is_published: formData.is_published,
        });

      if (error) {
        toast({ title: 'Error', description: 'Failed to create event', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Event created successfully' });
        fetchEvents();
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleEdit = (event: AlmanacEvent) => {
    setEditingEvent(event);
    setFormData({
      series_number: event.series_number,
      event_date: event.event_date,
      event_name: event.event_name,
      responsible_person: event.responsible_person,
      description: event.description || '',
      is_published: event.is_published,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('almanac_events')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Event deleted successfully' });
      fetchEvents();
    }
  };

  const togglePublished = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('almanac_events')
      .update({ is_published: !currentState })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } else {
      fetchEvents();
    }
  };

  const publishAllInSeries = async (seriesNumber: number) => {
    const { error } = await supabase
      .from('almanac_events')
      .update({ is_published: true })
      .eq('series_number', seriesNumber);

    if (error) {
      toast({ title: 'Error', description: 'Failed to publish events', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `All Series ${seriesNumber} events published` });
      fetchEvents();
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      series_number: parseInt(activeTab),
      event_date: '',
      event_name: '',
      responsible_person: '',
      description: '',
      is_published: false,
    });
  };

  const getEventsBySeries = (seriesNumber: number) => {
    return events.filter(event => event.series_number === seriesNumber);
  };

  const seriesList = [5, 6, 7];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Panel
        </Button>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Almanac Management
              </CardTitle>
              <CardDescription>
                Manage examination schedule and events for Series 5, 6 & 7
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button onClick={() => setFormData({ ...formData, series_number: parseInt(activeTab) })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="series_number">Series</Label>
                    <Select
                      value={formData.series_number.toString()}
                      onValueChange={(value) => setFormData({ ...formData, series_number: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {seriesList.map((s) => (
                          <SelectItem key={s} value={s.toString()}>Series {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="event_date">Event Date</Label>
                    <Input
                      id="event_date"
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="event_name">Event Name</Label>
                    <Select
                      value={formData.event_name}
                      onValueChange={(value) => setFormData({ ...formData, event_name: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select or type custom event" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventSuggestions.map((event) => (
                          <SelectItem key={event} value={event}>{event}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="event_name_custom"
                      placeholder="Or type custom event name"
                      value={formData.event_name}
                      onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsible_person">Responsible Person/Team</Label>
                    <Input
                      id="responsible_person"
                      placeholder="e.g., Exam Coordinator, Teachers"
                      value={formData.responsible_person}
                      onChange={(e) => setFormData({ ...formData, responsible_person: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Additional details about the event"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                    />
                    <Label htmlFor="is_published">Publish immediately</Label>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingEvent ? 'Update' : 'Create'} Event
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    {seriesList.map((series) => (
                      <TabsTrigger key={series} value={series.toString()}>
                        Series {series} ({getEventsBySeries(series).length})
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => publishAllInSeries(parseInt(activeTab))}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Publish All Series {activeTab}
                  </Button>
                </div>

                {seriesList.map((series) => (
                  <TabsContent key={series} value={series.toString()}>
                    {getEventsBySeries(series).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No events for Series {series} yet. Click "Add Event" to create one.
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Responsible</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getEventsBySeries(series).map((event) => (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">
                                {format(new Date(event.event_date), 'MMM dd, yyyy')}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{event.event_name}</div>
                                  {event.description && (
                                    <div className="text-sm text-muted-foreground">{event.description}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{event.responsible_person}</TableCell>
                              <TableCell>
                                <Button
                                  variant={event.is_published ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => togglePublished(event.id, event.is_published)}
                                >
                                  {event.is_published ? (
                                    <>
                                      <Eye className="h-3 w-3 mr-1" />
                                      Published
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="h-3 w-3 mr-1" />
                                      Draft
                                    </>
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlmanacManagementPage;