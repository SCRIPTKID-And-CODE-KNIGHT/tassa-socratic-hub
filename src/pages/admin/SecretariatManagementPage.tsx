import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Crown, Upload, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Committee = { id: string; slug: string; name: string; description: string | null; display_order: number; is_active: boolean };
type Member = {
  id: string; committee_id: string; full_name: string; position: string; is_chairperson: boolean;
  school: string | null; region: string | null; biography: string | null;
  profile_image_url: string | null; email: string | null; phone: string | null; profile_link: string | null;
  display_order: number; is_active: boolean;
};

const BUCKET = 'committee-images';
const MAX_DIM = 600;

async function resizeImage(file: File): Promise<Blob> {
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  await new Promise((r) => { img.onload = r; });
  const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.85)!);
}

const emptyMember = (committee_id: string): Partial<Member> => ({
  committee_id, full_name: '', position: 'Member', is_chairperson: false,
  school: '', region: '', biography: '', profile_image_url: '',
  email: '', phone: '', profile_link: '', display_order: 0, is_active: true,
});

export default function SecretariatManagementPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [activeCommitteeId, setActiveCommitteeId] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Partial<Member> | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [showCommitteeDlg, setShowCommitteeDlg] = useState(false);
  const [newCommittee, setNewCommittee] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }
      const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id);
      if (!roles?.some(r => r.role === 'admin')) { navigate('/'); return; }
      await loadCommittees();
      setLoading(false);
    })();
  }, [navigate]);

  useEffect(() => { if (activeCommitteeId) loadMembers(activeCommitteeId); }, [activeCommitteeId]);

  const loadCommittees = async () => {
    const { data } = await supabase.from('committees').select('*').order('display_order');
    setCommittees(data || []);
    if (data && data.length && !activeCommitteeId) setActiveCommitteeId(data[0].id);
  };

  const loadMembers = async (cid: string) => {
    const { data } = await supabase.from('committee_members').select('*').eq('committee_id', cid).order('display_order');
    setMembers(data || []);
  };

  const handleFile = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const blob = await resizeImage(file);
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
      setEditing((e) => ({ ...e!, profile_image_url: dataUrl }));
      toast({ title: 'Image ready', description: 'Click Save to publish to the site.' });
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e.message, variant: 'destructive' });
    } finally { setUploading(false); }
  };

  const saveMember = async () => {
    if (!editing || !editing.full_name) { toast({ title: 'Full name required', variant: 'destructive' }); return; }
    const payload: any = {
      committee_id: editing.committee_id || activeCommitteeId,
      full_name: editing.full_name,
      position: editing.is_chairperson ? 'Chairperson' : (editing.position || 'Member'),
      is_chairperson: !!editing.is_chairperson,
      school: editing.school || null, region: editing.region || null,
      biography: editing.biography || null, profile_image_url: editing.profile_image_url || null,
      email: editing.email || null, phone: editing.phone || null, profile_link: editing.profile_link || null,
      display_order: Number(editing.display_order ?? 0), is_active: editing.is_active ?? true,
    };
    const { error } = editing.id
      ? await supabase.from('committee_members').update(payload).eq('id', editing.id)
      : await supabase.from('committee_members').insert(payload);
    if (error) { toast({ title: 'Save failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Saved' });
    setEditing(null); setPreview('');
    await loadMembers(activeCommitteeId);
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Delete this member?')) return;
    const { error } = await supabase.from('committee_members').delete().eq('id', id);
    if (error) { toast({ title: 'Delete failed', description: error.message, variant: 'destructive' }); return; }
    await loadMembers(activeCommitteeId);
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= members.length) return;
    const a = members[idx], b = members[j];
    await supabase.from('committee_members').update({ display_order: b.display_order }).eq('id', a.id);
    await supabase.from('committee_members').update({ display_order: a.display_order }).eq('id', b.id);
    await loadMembers(activeCommitteeId);
  };

  const createCommittee = async () => {
    if (!newCommittee.name || !newCommittee.slug) { toast({ title: 'Name & slug required', variant: 'destructive' }); return; }
    const { error } = await supabase.from('committees').insert({
      name: newCommittee.name, slug: newCommittee.slug, description: newCommittee.description || null,
      display_order: committees.length, is_active: true,
    });
    if (error) { toast({ title: 'Failed', description: error.message, variant: 'destructive' }); return; }
    setNewCommittee({ name: '', slug: '', description: '' }); setShowCommitteeDlg(false);
    await loadCommittees();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const activeCommittee = committees.find(c => c.id === activeCommitteeId);

  return (
    <div className="min-h-screen py-10 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Admin
            </Button>
            <h1 className="text-3xl font-heading font-bold">Academic Secretariat & Committees</h1>
            <p className="text-muted-foreground">Manage committee members and leadership groups.</p>
          </div>
          <Button onClick={() => setShowCommitteeDlg(true)} variant="outline"><Plus className="h-4 w-4 mr-1" /> New Committee</Button>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {committees.map(c => (
            <Button key={c.id} variant={c.id === activeCommitteeId ? 'default' : 'outline'} size="sm" onClick={() => setActiveCommitteeId(c.id)}>
              {c.name}{!c.is_active && ' (hidden)'}
            </Button>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{activeCommittee?.name || 'Members'}</CardTitle>
            <Button onClick={() => { setEditing(emptyMember(activeCommitteeId)); setPreview(''); }} disabled={!activeCommitteeId}>
              <Plus className="h-4 w-4 mr-1" /> Add Member
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {members.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                    {m.profile_image_url
                      ? <img src={m.profile_image_url} alt={m.full_name} className="w-full h-full object-cover" />
                      : <User className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate">{m.full_name}</span>
                      {m.is_chairperson && <Badge className="bg-warning text-warning-foreground gap-1"><Crown className="h-3 w-3" />Chairperson</Badge>}
                      {!m.is_active && <Badge variant="secondary">Hidden</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {m.position}{m.school ? ` • ${m.school}` : ''}{m.region ? ` • ${m.region}` : ''}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(m); setPreview(m.profile_image_url || ''); }}><Edit className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMember(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              {!members.length && <p className="text-center text-muted-foreground py-8">No members yet.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editing} onOpenChange={(o) => { if (!o) { setEditing(null); setPreview(''); } }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? 'Edit Member' : 'Add Member'}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-4 border-primary/20 shrink-0">
                    {(preview || editing.profile_image_url)
                      ? <img src={preview || editing.profile_image_url!} className="w-full h-full object-cover" alt="preview" />
                      : <User className="h-8 w-8 text-muted-foreground" />}
                  </div>
                  <div className="space-y-2">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                    <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      <Upload className="h-4 w-4 mr-1" /> {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG/PNG. Auto-resized to {MAX_DIM}px.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><Label>Full Name *</Label><Input value={editing.full_name || ''} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} /></div>
                  <div>
                    <Label>Position</Label>
                    <Select value={editing.is_chairperson ? 'Chairperson' : (editing.position || 'Member')}
                      onValueChange={(v) => setEditing({ ...editing, position: v, is_chairperson: v === 'Chairperson' })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chairperson">Chairperson</SelectItem>
                        <SelectItem value="Vice Chairperson">Vice Chairperson</SelectItem>
                        <SelectItem value="Secretary">Secretary</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Display Order</Label><Input type="number" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></div>
                  <div><Label>School</Label><Input value={editing.school || ''} onChange={(e) => setEditing({ ...editing, school: e.target.value })} /></div>
                  <div><Label>Region</Label><Input value={editing.region || ''} onChange={(e) => setEditing({ ...editing, region: e.target.value })} /></div>
                  <div><Label>Email</Label><Input type="email" value={editing.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
                  <div><Label>Phone</Label><Input value={editing.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
                  <div className="col-span-2"><Label>Profile Link</Label><Input value={editing.profile_link || ''} onChange={(e) => setEditing({ ...editing, profile_link: e.target.value })} /></div>
                  <div className="col-span-2"><Label>Biography</Label><Textarea rows={3} value={editing.biography || ''} onChange={(e) => setEditing({ ...editing, biography: e.target.value })} /></div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                    <Label>Visible on site</Label>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => { setEditing(null); setPreview(''); }}>Cancel</Button>
              <Button onClick={saveMember}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Committee */}
        <Dialog open={showCommitteeDlg} onOpenChange={setShowCommitteeDlg}>
          <DialogContent>
            <DialogHeader><DialogTitle>New Committee</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={newCommittee.name} onChange={(e) => setNewCommittee({ ...newCommittee, name: e.target.value })} placeholder="e.g. Executive Committee" /></div>
              <div><Label>Slug</Label><Input value={newCommittee.slug} onChange={(e) => setNewCommittee({ ...newCommittee, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="e.g. executive-committee" /></div>
              <div><Label>Description</Label><Textarea value={newCommittee.description} onChange={(e) => setNewCommittee({ ...newCommittee, description: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCommitteeDlg(false)}>Cancel</Button>
              <Button onClick={createCommittee}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}