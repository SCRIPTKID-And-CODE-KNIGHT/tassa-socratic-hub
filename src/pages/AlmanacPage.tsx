import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BookOpen, Users, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface AlmanacEvent {
  id: string;
  series_number: number;
  event_date: string;
  event_name: string;
  responsible_person: string;
  description: string | null;
}

const AlmanacPage = () => {
  const [events, setEvents] = useState<AlmanacEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('5');

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('almanac_events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: true });

      if (data && !error) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const getEventsBySeries = (seriesNumber: number) => {
    return events.filter(event => event.series_number === seriesNumber);
  };

  const seriesList = [5, 6, 7];

  const getEventIcon = (eventName: string) => {
    const name = eventName.toLowerCase();
    if (name.includes('exam') || name.includes('test')) return <BookOpen className="h-4 w-4 text-primary" />;
    if (name.includes('submission') || name.includes('submit')) return <Clock className="h-4 w-4 text-orange-500" />;
    if (name.includes('marking') || name.includes('moderation')) return <Users className="h-4 w-4 text-purple-500" />;
    return <Calendar className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              TASSA 2026 Almanac
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Complete schedule for Series 5, 6 & 7 examinations and related activities
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-indigo-500/5 border-b">
            <CardTitle className="text-2xl flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              Examination Schedule 2026
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">No Events Published Yet</h3>
                <p className="text-muted-foreground mt-2">
                  The almanac schedule will be published soon. Please check back later.
                </p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  {seriesList.map((series) => (
                    <TabsTrigger 
                      key={series} 
                      value={series.toString()}
                      className="text-lg font-semibold"
                    >
                      Series {series}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {seriesList.map((series) => (
                  <TabsContent key={series} value={series.toString()}>
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-primary/10 to-indigo-500/10">
                            <TableHead className="font-bold text-foreground w-[150px]">Date</TableHead>
                            <TableHead className="font-bold text-foreground">Event</TableHead>
                            <TableHead className="font-bold text-foreground w-[200px]">Responsible</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getEventsBySeries(series).length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No events scheduled for Series {series} yet.
                              </TableCell>
                            </TableRow>
                          ) : (
                            getEventsBySeries(series).map((event, index) => (
                              <TableRow 
                                key={event.id}
                                className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}
                              >
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    {format(new Date(event.event_date), 'MMM dd, yyyy')}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {getEventIcon(event.event_name)}
                                    <div>
                                      <div className="font-medium">{event.event_name}</div>
                                      {event.description && (
                                        <div className="text-sm text-muted-foreground">{event.description}</div>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    {event.responsible_person}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Event Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-sm">Examination</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-sm">Submission</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <span className="text-sm">Marking/Moderation</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Other Activities</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlmanacPage;