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
import { Store, Plus, Edit, Search, Book, FileText, Folder, BookOpen, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StoreMaterial {
  id: string;
  title: string;
  description: string | null;
  material_type: string;
  file_url: string | null;
  price: number | null;
  subject: string | null;
  grade_level: string | null;
  is_published: boolean;
  created_at: string;
  harakapay_link: string | null;
}

const StoreMaterialsPage = () => {
  const [materials, setMaterials] = useState<StoreMaterial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<StoreMaterial | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    material_type: 'book',
    file_url: '',
    price: '',
    subject: '',
    grade_level: '',
    is_published: false,
    harakapay_link: ''
  });

  const materialTypes = [
    { value: 'book', label: 'Books', icon: Book },
    { value: 'lesson_notes', label: 'Lesson Notes', icon: FileText },
    { value: 'scheme_of_work', label: 'Scheme of Work', icon: Folder },
    { value: 'lesson_plans', label: 'Lesson Plans', icon: BookOpen },
    { value: 'log_books', label: 'Log Books', icon: ClipboardList }
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('store_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch store materials",
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

      const materialData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        description: formData.description || null,
        file_url: formData.file_url || null,
        subject: formData.subject || null,
        grade_level: formData.grade_level || null,
        harakapay_link: formData.harakapay_link || null,
        published_by: user.id
      };

      if (editingMaterial) {
        const { error } = await supabase
          .from('store_materials')
          .update(materialData)
          .eq('id', editingMaterial.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Material updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('store_materials')
          .insert(materialData);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Material added successfully"
        });
      }

      setShowAddDialog(false);
      setEditingMaterial(null);
      resetForm();
      fetchMaterials();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save material",
        variant: "destructive"
      });
    }
  };

  const togglePublishStatus = async (material: StoreMaterial) => {
    try {
      const { error } = await supabase
        .from('store_materials')
        .update({ is_published: !material.is_published })
        .eq('id', material.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Material ${!material.is_published ? 'published' : 'unpublished'} successfully`
      });
      
      fetchMaterials();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update publish status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      material_type: 'book',
      file_url: '',
      price: '',
      subject: '',
      grade_level: '',
      is_published: false,
      harakapay_link: ''
    });
  };

  const openEditDialog = (material: StoreMaterial) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || '',
      material_type: material.material_type,
      file_url: material.file_url || '',
      price: material.price?.toString() || '',
      subject: material.subject || '',
      grade_level: material.grade_level || '',
      is_published: material.is_published,
      harakapay_link: material.harakapay_link || ''
    });
    setShowAddDialog(true);
  };

  const getMaterialIcon = (type: string) => {
    const materialType = materialTypes.find(mt => mt.value === type);
    return materialType ? materialType.icon : Book;
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.subject && material.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (material.grade_level && material.grade_level.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || material.material_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen py-8 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Store Materials Management
            </h1>
            <p className="text-muted-foreground">
              Publish and manage educational materials for teachers
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="btn-educational" onClick={() => { resetForm(); setEditingMaterial(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMaterial ? 'Edit Material' : 'Add New Material'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Material title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="material_type">Material Type *</Label>
                    <Select value={formData.material_type} onValueChange={(value: any) => setFormData({...formData, material_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {materialTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Material description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="e.g., Geography, History"
                    />
                  </div>
                  <div>
                    <Label htmlFor="grade_level">Grade Level</Label>
                    <Input
                      value={formData.grade_level}
                      onChange={(e) => setFormData({...formData, grade_level: e.target.value})}
                      placeholder="e.g., Form 1, Form 2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (TZS)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00 (optional)"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                    />
                    <Label>Publish immediately</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="file_url">File URL/Link (for free materials)</Label>
                  <Input
                    value={formData.file_url}
                    onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                    placeholder="https://... (Google Drive, Dropbox, etc.)"
                  />
                </div>

                <div>
                  <Label htmlFor="harakapay_link">HarakaPay Link (for paid materials)</Label>
                  <Input
                    value={formData.harakapay_link}
                    onChange={(e) => setFormData({...formData, harakapay_link: e.target.value})}
                    placeholder="https://harakapay.net/pay/XXXXXXXXXX"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Users will be redirected to this link to complete payment
                  </p>
                </div>

                <Button type="submit" className="w-full btn-educational">
                  {editingMaterial ? 'Update Material' : 'Add Material'}
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
                  placeholder="Search materials, subjects, or grade levels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {materialTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Materials Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Store Materials ({filteredMaterials.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading materials...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material) => {
                      const IconComponent = getMaterialIcon(material.material_type);
                      return (
                        <TableRow key={material.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <IconComponent className="h-4 w-4 text-primary" />
                              <div>
                                <div className="font-medium">{material.title}</div>
                                {material.description && (
                                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                                    {material.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {materialTypes.find(mt => mt.value === material.material_type)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{material.subject || '-'}</TableCell>
                          <TableCell>{material.grade_level || '-'}</TableCell>
                          <TableCell>
                            {material.price ? `TZS ${material.price.toLocaleString()}` : 'Free'}
                          </TableCell>
                          <TableCell>
                          <Badge variant={material.is_published ? 'default' : 'secondary'}>
                            {material.is_published ? 'Published' : 'Draft'}
                          </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(material)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Switch
                                checked={material.is_published}
                                onCheckedChange={() => togglePublishStatus(material)}
                              />
                            </div>
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
      </div>
    </div>
  );
};

export default StoreMaterialsPage;