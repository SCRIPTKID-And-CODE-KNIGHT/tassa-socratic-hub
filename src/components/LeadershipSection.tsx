import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, User, MapPin, School as SchoolIcon, Mail, Phone, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Member = {
  id: string;
  full_name: string;
  position: string;
  is_chairperson: boolean;
  school: string | null;
  region: string | null;
  biography: string | null;
  profile_image_url: string | null;
  email: string | null;
  phone: string | null;
  profile_link: string | null;
  display_order: number;
};

type Committee = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
  members: Member[];
};

const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();

const MemberCard = ({ m, onView }: { m: Member; onView: (m: Member) => void }) => {
  const chair = m.is_chairperson;
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-xl ${chair ? 'ring-2 ring-warning shadow-lg bg-gradient-to-b from-warning/10 to-card' : 'hover:-translate-y-1'}`}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className={`w-28 h-28 rounded-full overflow-hidden border-4 ${chair ? 'border-warning' : 'border-primary/20'} bg-muted flex items-center justify-center`}>
            {m.profile_image_url ? (
              <img src={m.profile_image_url} alt={m.full_name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">{initials(m.full_name)}</span>
            )}
          </div>
          {chair && (
            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-warning text-warning-foreground gap-1 whitespace-nowrap">
              <Crown className="h-3 w-3" /> Chairperson
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-foreground leading-tight">{m.full_name}</h3>
        <p className={`text-sm mt-1 ${chair ? 'text-warning font-semibold' : 'text-primary'}`}>{m.position}</p>
        {m.school && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 justify-center">
            <SchoolIcon className="h-3 w-3" /> {m.school}
          </p>
        )}
        {m.region && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
            <MapPin className="h-3 w-3" /> {m.region}
          </p>
        )}
        <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => onView(m)}>
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default function LeadershipSection() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [viewing, setViewing] = useState<Member | null>(null);

  useEffect(() => {
    (async () => {
      const { data: cs } = await supabase
        .from('committees')
        .select('id, slug, name, description, display_order')
        .eq('is_active', true)
        .order('display_order');
      const { data: ms } = await supabase
        .from('committee_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      const grouped = (cs || []).map(c => ({
        ...c,
        members: (ms || [])
          .filter(m => m.committee_id === c.id)
          .sort((a, b) => (b.is_chairperson ? 1 : 0) - (a.is_chairperson ? 1 : 0) || a.display_order - b.display_order),
      }));
      setCommittees(grouped);
    })();
  }, []);

  if (!committees.length) return null;

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {committees.map((c) => (
          <div key={c.id} className="mb-16 last:mb-0">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Our Leadership</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">{c.name}</h2>
              {c.description && (
                <p className="text-muted-foreground max-w-2xl mx-auto mt-3">{c.description}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {c.members.map((m) => (
                <MemberCard key={m.id} m={m} onView={setViewing} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.full_name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-muted flex items-center justify-center">
                  {viewing.profile_image_url ? (
                    <img src={viewing.profile_image_url} alt={viewing.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <Badge variant={viewing.is_chairperson ? 'default' : 'secondary'} className={viewing.is_chairperson ? 'bg-warning text-warning-foreground' : ''}>
                  {viewing.position}
                </Badge>
                {viewing.school && <p className="text-sm"><SchoolIcon className="inline h-4 w-4 mr-1" />{viewing.school}</p>}
                {viewing.region && <p className="text-sm text-muted-foreground"><MapPin className="inline h-4 w-4 mr-1" />{viewing.region}</p>}
                {viewing.biography && <p className="text-sm text-muted-foreground">{viewing.biography}</p>}
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  {viewing.email && <a href={`mailto:${viewing.email}`}><Button size="sm" variant="outline"><Mail className="h-4 w-4 mr-1" />Email</Button></a>}
                  {viewing.phone && <a href={`tel:${viewing.phone}`}><Button size="sm" variant="outline"><Phone className="h-4 w-4 mr-1" />Call</Button></a>}
                  {viewing.profile_link && <a href={viewing.profile_link} target="_blank" rel="noreferrer"><Button size="sm" variant="outline"><ExternalLink className="h-4 w-4 mr-1" />Profile</Button></a>}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}