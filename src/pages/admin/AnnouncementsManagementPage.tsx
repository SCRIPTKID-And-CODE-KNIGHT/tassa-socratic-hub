import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Megaphone, Plus, Edit, Search, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  is_published: boolean;
  created_at: string;
  created_by: string | null;
}

const AnnouncementsManagementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    is_published: false
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const announcementData = {
        ...formData,
        created_by: user.id
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editingAnnouncement.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Announcement updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert(announcementData);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Announcement created successfully"
        });
      }

      setShowAddDialog(false);
      setEditingAnnouncement(null);
      resetForm();
      fetchAnnouncements();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save announcement",
        variant: "destructive"
      });
    }
  };

  const togglePublishStatus = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_published: !announcement.is_published })
        .eq('id', announcement.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Announcement ${!announcement.is_published ? 'published' : 'unpublished'} successfully`
      });
      
      fetchAnnouncements();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update publish status",
        variant: "destructive"
      });
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Announcement deleted successfully"
      });
      
      fetchAnnouncements();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      is_published: false
    });
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      is_published: announcement.is_published
    });
    setShowAddDialog(true);
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'outline';
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="min-h-screen py-8 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Announcements Management
            </h1>
            <p className="text-muted-foreground">
              Create and manage announcements for teachers and schools
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="btn-educational" onClick={() => { resetForm(); setEditingAnnouncement(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Announcement title"
                    required
                    maxLength={200}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your announcement content here..."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: any) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority - Urgent</SelectItem>
                        <SelectItem value="medium">Medium Priority - Important</SelectItem>
                        <SelectItem value="low">Low Priority - Informational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                    />
                    <Label>Publish immediately</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full btn-educational">
                  {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
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
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Megaphone className="h-5 w-5 mr-2" />
              Announcements ({filteredAnnouncements.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading announcements...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnnouncements.map((announcement) => (
                      <TableRow key={announcement.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{announcement.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {announcement.content}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(announcement.priority) as any}>
                            {announcement.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={announcement.is_published ? 'default' : 'secondary'}>
                            {announcement.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(announcement)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Switch
                              checked={announcement.is_published}
                              onCheckedChange={() => togglePublishStatus(announcement)}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteAnnouncement(announcement.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementsManagementPage;