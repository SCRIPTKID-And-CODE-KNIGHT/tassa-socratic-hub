import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Video, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StoreMaterial {
  id: string;
  title: string;
  description: string | null;
  material_type: string;
  file_url: string | null;
  price: number | null;
  subject: string | null;
  grade_level: string | null;
  is_published: boolean | null;
}

const StorePage = () => {
  const [materials, setMaterials] = useState<StoreMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('store_materials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'book':
        return <BookOpen className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || material.material_type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Educational Materials Store</h1>
          <p className="text-muted-foreground">Browse our collection of books, documents, and learning resources</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Book">Books</SelectItem>
              <SelectItem value="Document">Documents</SelectItem>
              <SelectItem value="Video">Videos</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No materials found</h3>
            <p className="text-muted-foreground">
              {materials.length === 0 
                ? 'Check back soon for new educational materials!'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getMaterialIcon(material.material_type)}
                      <Badge variant="secondary">{material.material_type}</Badge>
                    </div>
                    {material.price !== null && material.price > 0 && (
                      <Badge variant="outline" className="font-semibold">
                        TZS {material.price.toLocaleString()}
                      </Badge>
                    )}
                    {(material.price === null || material.price === 0) && (
                      <Badge variant="outline" className="font-semibold text-green-600">
                        Free
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{material.title}</CardTitle>
                  {material.description && (
                    <CardDescription className="line-clamp-3">
                      {material.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {material.subject && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Subject:</span>
                        <Badge variant="outline">{material.subject}</Badge>
                      </div>
                    )}
                    {material.grade_level && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Grade:</span>
                        <Badge variant="outline">{material.grade_level}</Badge>
                      </div>
                    )}
                  </div>
                  {material.file_url && (
                    <Button 
                      className="w-full" 
                      onClick={() => window.open(material.file_url!, '_blank')}
                    >
                      View Material
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
