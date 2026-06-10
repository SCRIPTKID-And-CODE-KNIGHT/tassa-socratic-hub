import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Video, Package, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
  harakapay_link: string | null;
  image_url: string | null;
}

const WHATSAPP_NUMBER = '255752837561';

const StorePage = () => {
  const [materials, setMaterials] = useState<StoreMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedForm, setSelectedForm] = useState('all');
  const { toast } = useToast();

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

  const handleOrder = (material: StoreMaterial) => {
    const price = material.price ? `TZS ${material.price.toLocaleString()}` : 'Free';
    const lines = [
      `Hello TASSA, I would like to order the following item:`,
      ``,
      `📚 Title: ${material.title}`,
      `🏷️ Type: ${material.material_type}`,
      material.subject ? `📘 Subject: ${material.subject}` : '',
      material.grade_level ? `🎓 Level: ${material.grade_level}` : '',
      `💰 Price: ${price}`,
      ``,
      `Please share payment and delivery instructions. Asante!`,
    ].filter(Boolean).join('\n');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || material.material_type === selectedType;
    const grade = (material.grade_level || '').toLowerCase();
    const matchesForm =
      selectedForm === 'all' ||
      (selectedForm === 'form5' && (grade.includes('form 5') || grade.includes('form five') || grade.includes('form v'))) ||
      (selectedForm === 'form6' && (grade.includes('form 6') || grade.includes('form six') || grade.includes('form vi')));
    return matchesSearch && matchesType && matchesForm;
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
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="form5">Form Five</SelectItem>
              <SelectItem value="form6">Form Six</SelectItem>
            </SelectContent>
          </Select>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="group overflow-hidden border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                {/* Cover */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex items-center justify-center overflow-hidden">
                  {material.image_url ? (
                    <img
                      src={material.image_url}
                      alt={material.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.15),transparent_60%)]" />
                      <div className="relative h-20 w-20 rounded-2xl bg-card shadow-md flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {getMaterialIcon(material.material_type)}
                      </div>
                    </>
                  )}
                  <Badge variant="secondary" className="absolute top-3 left-3 backdrop-blur bg-card/80">{material.material_type}</Badge>
                  {material.price !== null && material.price > 0 ? (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground font-bold shadow">
                      TZS {material.price.toLocaleString()}
                    </Badge>
                  ) : (
                    <Badge className="absolute top-3 right-3 bg-success text-success-foreground font-bold shadow">Free</Badge>
                  )}
                </div>

                <CardContent className="pt-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-1">{material.title}</h3>
                  {material.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{material.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {material.subject && <Badge variant="outline" className="text-xs">{material.subject}</Badge>}
                    {material.grade_level && <Badge variant="outline" className="text-xs">{material.grade_level}</Badge>}
                  </div>

                  <div className="mt-auto">
                    {material.price !== null && material.price > 0 ? (
                      <Button
                        className="w-full bg-[#25D366] hover:bg-[#1da851] text-white"
                        onClick={() => handleOrder(material)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Order Now
                      </Button>
                    ) : material.file_url ? (
                      <Button className="w-full" onClick={() => window.open(material.file_url!, '_blank')}>
                        View Material
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOrder(material)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Request via WhatsApp
                      </Button>
                    )}
                  </div>
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
