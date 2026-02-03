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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Plus, Calendar, Edit, Trash2, Eye, EyeOff, Wand2, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { generateFullAlmanac, SeriesSchedule, getHolidays2026 } from '@/lib/almanacScheduler';

interface AlmanacEvent {
  id: string;
  series_number: number;
  event_date: string;
  event_start_date: string | null;
  event_end_date: string | null;
  event_name: string;
  responsible_person: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

const AlmanacManagementPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<AlmanacEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AlmanacEvent | null>(null);
  const [activeTab, setActiveTab] = useState('5');
  const [generatedSchedules, setGeneratedSchedules] = useState<SeriesSchedule[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    series_number: 5,
    event_start_date: '',
    event_end_date: '',
    event_name: '',
    responsible_person: '',
    description: '',
    is_published: false,
  });

  const seriesList = [5, 6, 7, 8];

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
      .order('series_number', { ascending: true })
      .order('event_start_date', { ascending: true });

    if (data && !error) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleGenerateSchedule = () => {
    const schedules = generateFullAlmanac();
    setGeneratedSchedules(schedules);
    setGenerateDialogOpen(true);
  };

  const handleApplyGenerated = async () => {
    setIsGenerating(true);
    
    try {
      // Delete existing events for series 5-8
      await supabase
        .from('almanac_events')
        .delete()
        .in('series_number', [5, 6, 7, 8]);

      // Insert new events
      const newEvents = generatedSchedules.flatMap(schedule => 
        schedule.events.map(event => ({
          series_number: schedule.series_number,
          event_name: event.event_name,
          event_date: event.event_start_date,
          event_start_date: event.event_start_date,
          event_end_date: event.event_end_date,
          responsible_person: event.responsible_person,
          description: event.description,
          is_published: false,
        }))
      );

      const { error } = await supabase
        .from('almanac_events')
        .insert(newEvents);

      if (error) {
        throw error;
      }

      toast({ 
        title: 'Schedule Generated', 
        description: `Successfully created ${newEvents.length} events across Series 5-8` 
      });
      
      setGenerateDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error applying schedule:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to apply generated schedule', 
        variant: 'destructive' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      series_number: formData.series_number,
      event_date: formData.event_start_date,
      event_start_date: formData.event_start_date,
      event_end_date: formData.event_end_date || formData.event_start_date,
      event_name: formData.event_name,
      responsible_person: formData.responsible_person,
      description: formData.description || null,
      is_published: formData.is_published,
    };

    if (editingEvent) {
      const { error } = await supabase
        .from('almanac_events')
        .update(eventData)
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
        .insert(eventData);

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
      event_start_date: event.event_start_date || event.event_date,
      event_end_date: event.event_end_date || event.event_date,
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
      event_start_date: '',
      event_end_date: '',
      event_name: '',
      responsible_person: '',
      description: '',
      is_published: false,
    });
  };

  const getEventsBySeries = (seriesNumber: number) => {
    return events.filter(event => event.series_number === seriesNumber);
  };

  const formatDateRange = (startDate: string | null, endDate: string | null): string => {
    if (!startDate) return 'TBD';
    const start = format(new Date(startDate), 'dd MMM yyyy');
    if (!endDate || startDate === endDate) return start;
    const end = format(new Date(endDate), 'dd MMM yyyy');
    return `${start} - ${end}`;
  };

  const holidays = getHolidays2026();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Panel
        </Button>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Almanac Management
              </CardTitle>
              <CardDescription>
                Manage examination schedule for Series 5, 6, 7 & 8 (32 working days each)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGenerateSchedule}>
                <Wand2 className="h-4 w-4 mr-2" />
                Auto-Generate Schedule
              </Button>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event_start_date">Start Date</Label>
                        <Input
                          id="event_start_date"
                          type="date"
                          value={formData.event_start_date}
                          onChange={(e) => setFormData({ ...formData, event_start_date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="event_end_date">End Date</Label>
                        <Input
                          id="event_end_date"
                          type="date"
                          value={formData.event_end_date}
                          onChange={(e) => setFormData({ ...formData, event_end_date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="event_name">Event Name</Label>
                      <Input
                        id="event_name"
                        placeholder="Enter event name"
                        value={formData.event_name}
                        onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                        required
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
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
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
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No events for Series {series} yet.</p>
                        <p className="text-sm mt-2">Click "Auto-Generate Schedule" or "Add Event" to create events.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead className="w-[200px]">Date Range</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Responsible</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getEventsBySeries(series).map((event, index) => (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium text-muted-foreground">
                                {index + 1}
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatDateRange(event.event_start_date, event.event_end_date)}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{event.event_name}</div>
                                  {event.description && (
                                    <div className="text-sm text-muted-foreground line-clamp-1">{event.description}</div>
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

        {/* Holidays Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              2026 Public Holidays (Skipped)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {holidays.map((holiday) => (
                <Badge key={holiday} variant="secondary">
                  {format(new Date(holiday), 'dd MMM yyyy')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Schedule Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Auto-Generated Examination Schedule
            </DialogTitle>
            <DialogDescription>
              Preview the automatically calculated schedule for Series 5-8. Each series has 32 working days.
            </DialogDescription>
          </DialogHeader>
          
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This will replace all existing events for Series 5-8. Make sure to review the schedule before applying.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {generatedSchedules.map((schedule) => (
              <div key={schedule.series_number} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Series {schedule.series_number}</h3>
                  <Badge variant="outline">
                    {format(new Date(schedule.official_start_date), 'dd MMM')} - {format(new Date(schedule.official_end_date), 'dd MMM yyyy')}
                  </Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead className="w-[180px]">Date Range</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Responsible</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.events.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="text-sm">
                          {event.event_start_date === event.event_end_date 
                            ? format(new Date(event.event_start_date), 'dd MMM yyyy')
                            : `${format(new Date(event.event_start_date), 'dd MMM')} - ${format(new Date(event.event_end_date), 'dd MMM yyyy')}`
                          }
                        </TableCell>
                        <TableCell className="font-medium">{event.event_name}</TableCell>
                        <TableCell className="text-muted-foreground">{event.responsible_person}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyGenerated} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply Schedule
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlmanacManagementPage;
