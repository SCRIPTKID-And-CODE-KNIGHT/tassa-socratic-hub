import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Plus, Pencil, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TopStudent {
  id: string;
  student_name: string;
  school_name: string;
  marks: number;
  subject: string;
  position: number;
  region: string;
  district: string;
  series_number: number;
  is_published: boolean;
}

interface BestSchool {
  id: string;
  school_name: string;
  average_marks: number;
  position: number;
  region: string;
  district: string;
  series_number: number;
  total_students: number;
  is_published: boolean;
}

const HallOfExcellenceManagementPage = () => {
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [bestSchools, setBestSchools] = useState<BestSchool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Student form state
  const [studentForm, setStudentForm] = useState({
    student_name: '',
    school_name: '',
    marks: '',
    subject: '',
    position: '',
    region: '',
    district: '',
    series_number: '1'
  });

  // School form state
  const [schoolForm, setSchoolForm] = useState({
    school_name: '',
    average_marks: '',
    position: '',
    region: '',
    district: '',
    series_number: '1',
    total_students: ''
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id);

    const isAdmin = roles?.some(r => r.role === 'admin');
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
      navigate('/');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    
    const { data: students } = await supabase
      .from('top_students')
      .select('*')
      .order('series_number', { ascending: false })
      .order('position', { ascending: true });

    const { data: schools } = await supabase
      .from('best_schools')
      .select('*')
      .order('series_number', { ascending: false })
      .order('position', { ascending: true });

    setTopStudents(students || []);
    setBestSchools(schools || []);
    setIsLoading(false);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const studentData = {
        student_name: studentForm.student_name,
        school_name: studentForm.school_name,
        marks: parseInt(studentForm.marks),
        subject: studentForm.subject,
        position: parseInt(studentForm.position),
        region: studentForm.region,
        district: studentForm.district,
        series_number: parseInt(studentForm.series_number),
        is_published: false
      };

      if (editingId) {
        await supabase
          .from('top_students')
          .update(studentData)
          .eq('id', editingId);
        toast({ title: "Student updated successfully" });
      } else {
        await supabase
          .from('top_students')
          .insert(studentData);
        toast({ title: "Student added successfully" });
      }

      setIsDialogOpen(false);
      setEditingId(null);
      resetStudentForm();
      fetchData();
    } catch (error) {
      toast({ title: "Error saving student", variant: "destructive" });
    }
  };

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const schoolData = {
        school_name: schoolForm.school_name,
        average_marks: parseFloat(schoolForm.average_marks),
        position: parseInt(schoolForm.position),
        region: schoolForm.region,
        district: schoolForm.district,
        series_number: parseInt(schoolForm.series_number),
        total_students: parseInt(schoolForm.total_students),
        is_published: false
      };

      if (editingId) {
        await supabase
          .from('best_schools')
          .update(schoolData)
          .eq('id', editingId);
        toast({ title: "School updated successfully" });
      } else {
        await supabase
          .from('best_schools')
          .insert(schoolData);
        toast({ title: "School added successfully" });
      }

      setIsDialogOpen(false);
      setEditingId(null);
      resetSchoolForm();
      fetchData();
    } catch (error) {
      toast({ title: "Error saving school", variant: "destructive" });
    }
  };

  const togglePublishStudent = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('top_students')
      .update({ is_published: !currentStatus })
      .eq('id', id);
    toast({ title: `Student ${!currentStatus ? 'published' : 'unpublished'}` });
    fetchData();
  };

  const togglePublishSchool = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('best_schools')
      .update({ is_published: !currentStatus })
      .eq('id', id);
    toast({ title: `School ${!currentStatus ? 'published' : 'unpublished'}` });
    fetchData();
  };

  const deleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await supabase.from('top_students').delete().eq('id', id);
      toast({ title: "Student deleted" });
      fetchData();
    }
  };

  const deleteSchool = async (id: string) => {
    if (confirm('Are you sure you want to delete this school?')) {
      await supabase.from('best_schools').delete().eq('id', id);
      toast({ title: "School deleted" });
      fetchData();
    }
  };

  const openStudentDialog = (student?: TopStudent) => {
    if (student) {
      setEditingId(student.id);
      setStudentForm({
        student_name: student.student_name,
        school_name: student.school_name,
        marks: student.marks.toString(),
        subject: student.subject,
        position: student.position.toString(),
        region: student.region,
        district: student.district,
        series_number: student.series_number.toString()
      });
    }
    setActiveTab('students');
    setIsDialogOpen(true);
  };

  const openSchoolDialog = (school?: BestSchool) => {
    if (school) {
      setEditingId(school.id);
      setSchoolForm({
        school_name: school.school_name,
        average_marks: school.average_marks.toString(),
        position: school.position.toString(),
        region: school.region,
        district: school.district,
        series_number: school.series_number.toString(),
        total_students: school.total_students?.toString() || ''
      });
    }
    setActiveTab('schools');
    setIsDialogOpen(true);
  };

  const resetStudentForm = () => {
    setStudentForm({
      student_name: '',
      school_name: '',
      marks: '',
      subject: '',
      position: '',
      region: '',
      district: '',
      series_number: '1'
    });
  };

  const resetSchoolForm = () => {
    setSchoolForm({
      school_name: '',
      average_marks: '',
      position: '',
      region: '',
      district: '',
      series_number: '1',
      total_students: ''
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Hall of Excellence Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage top performing students and schools
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Top Students</span>
            </TabsTrigger>
            <TabsTrigger value="schools" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Best Schools</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Top Performing Students</CardTitle>
                  <Button onClick={() => { resetStudentForm(); setEditingId(null); openStudentDialog(); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Series</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-bold">{student.position}</TableCell>
                        <TableCell>{student.student_name}</TableCell>
                        <TableCell>{student.school_name}</TableCell>
                        <TableCell>{student.subject}</TableCell>
                        <TableCell>{student.marks}</TableCell>
                        <TableCell>Series {student.series_number}</TableCell>
                        <TableCell>
                          <Badge variant={student.is_published ? "default" : "secondary"}>
                            {student.is_published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => openStudentDialog(student)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => togglePublishStudent(student.id, student.is_published)}
                            >
                              {student.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteStudent(student.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Top Performing Schools</CardTitle>
                  <Button onClick={() => { resetSchoolForm(); setEditingId(null); openSchoolDialog(); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add School
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>School Name</TableHead>
                      <TableHead>Average Marks</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Series</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bestSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-bold">{school.position}</TableCell>
                        <TableCell>{school.school_name}</TableCell>
                        <TableCell>{school.average_marks.toFixed(2)}</TableCell>
                        <TableCell>{school.total_students || 'N/A'}</TableCell>
                        <TableCell>Series {school.series_number}</TableCell>
                        <TableCell>
                          <Badge variant={school.is_published ? "default" : "secondary"}>
                            {school.is_published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => openSchoolDialog(school)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => togglePublishSchool(school.id, school.is_published)}
                            >
                              {school.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteSchool(school.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit' : 'Add'} {activeTab === 'students' ? 'Top Student' : 'Best School'}
              </DialogTitle>
            </DialogHeader>

            {activeTab === 'students' ? (
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="student_name">Student Name</Label>
                    <Input
                      id="student_name"
                      value={studentForm.student_name}
                      onChange={(e) => setStudentForm({ ...studentForm, student_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="school_name">School Name</Label>
                    <Input
                      id="school_name"
                      value={studentForm.school_name}
                      onChange={(e) => setStudentForm({ ...studentForm, school_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={studentForm.subject}
                      onChange={(e) => setStudentForm({ ...studentForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="marks">Marks</Label>
                    <Input
                      id="marks"
                      type="number"
                      value={studentForm.marks}
                      onChange={(e) => setStudentForm({ ...studentForm, marks: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      type="number"
                      value={studentForm.position}
                      onChange={(e) => setStudentForm({ ...studentForm, position: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="series_number">Series Number</Label>
                    <Select value={studentForm.series_number} onValueChange={(value) => setStudentForm({ ...studentForm, series_number: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            Series {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      value={studentForm.region}
                      onChange={(e) => setStudentForm({ ...studentForm, region: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={studentForm.district}
                      onChange={(e) => setStudentForm({ ...studentForm, district: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? 'Update' : 'Add'} Student
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSchoolSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="school_name_form">School Name</Label>
                    <Input
                      id="school_name_form"
                      value={schoolForm.school_name}
                      onChange={(e) => setSchoolForm({ ...schoolForm, school_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="average_marks">Average Marks</Label>
                    <Input
                      id="average_marks"
                      type="number"
                      step="0.01"
                      value={schoolForm.average_marks}
                      onChange={(e) => setSchoolForm({ ...schoolForm, average_marks: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position_school">Position</Label>
                    <Input
                      id="position_school"
                      type="number"
                      value={schoolForm.position}
                      onChange={(e) => setSchoolForm({ ...schoolForm, position: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_students">Total Students</Label>
                    <Input
                      id="total_students"
                      type="number"
                      value={schoolForm.total_students}
                      onChange={(e) => setSchoolForm({ ...schoolForm, total_students: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="series_number_school">Series Number</Label>
                    <Select value={schoolForm.series_number} onValueChange={(value) => setSchoolForm({ ...schoolForm, series_number: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            Series {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="region_school">Region</Label>
                    <Input
                      id="region_school"
                      value={schoolForm.region}
                      onChange={(e) => setSchoolForm({ ...schoolForm, region: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="district_school">District</Label>
                    <Input
                      id="district_school"
                      value={schoolForm.district}
                      onChange={(e) => setSchoolForm({ ...schoolForm, district: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? 'Update' : 'Add'} School
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HallOfExcellenceManagementPage;
