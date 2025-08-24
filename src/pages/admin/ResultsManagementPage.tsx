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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { BarChart3, Plus, Edit, Search, Trophy, School, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TopStudent {
  id: string;
  student_name: string;
  school_name: string;
  region: string;
  district: string;
  series_number: number;
  subject: string;
  marks: number;
  position: number;
  is_published: boolean;
}

interface BestSchool {
  id: string;
  school_name: string;
  region: string;
  district: string;
  series_number: number;
  average_marks: number;
  position: number;
  total_students: number;
  is_published: boolean;
}

const tanzanianRegions = [
  'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera', 'Katavi', 
  'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara', 'Mbeya', 'Morogoro', 
  'Mtwara', 'Mwanza', 'Njombe', 'Pemba North', 'Pemba South', 'Pwani', 
  'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu', 'Singida', 'Songwe', 'Tabora', 
  'Tanga', 'Unguja North', 'Unguja South'
];

const ResultsManagementPage = () => {
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [bestSchools, setBestSchools] = useState<BestSchool[]>([]);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [showSchoolDialog, setShowSchoolDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<TopStudent | null>(null);
  const [editingSchool, setEditingSchool] = useState<BestSchool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [studentForm, setStudentForm] = useState({
    student_name: '',
    school_name: '',
    region: '',
    district: '',
    series_number: 1,
    subject: '',
    marks: '',
    position: '',
    is_published: false
  });

  const [schoolForm, setSchoolForm] = useState({
    school_name: '',
    region: '',
    district: '',
    series_number: 1,
    average_marks: '',
    position: '',
    total_students: '',
    is_published: false
  });

  const [bulkUploadData, setBulkUploadData] = useState('');

  useEffect(() => {
    fetchTopStudents();
    fetchBestSchools();
  }, []);

  const fetchTopStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('top_students')
        .select('*')
        .order('series_number', { ascending: false })
        .order('position', { ascending: true });

      if (error) throw error;
      setTopStudents(data || []);
    } catch (error) {
      console.error('Error fetching top students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch top students data",
        variant: "destructive"
      });
    }
  };

  const fetchBestSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('best_schools')
        .select('*')
        .order('series_number', { ascending: false })
        .order('position', { ascending: true });

      if (error) throw error;
      setBestSchools(data || []);
    } catch (error) {
      console.error('Error fetching best schools:', error);
      toast({
        title: "Error",
        description: "Failed to fetch best schools data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const studentData = {
        ...studentForm,
        marks: parseInt(studentForm.marks),
        position: parseInt(studentForm.position),
        published_by: user.id
      };

      if (editingStudent) {
        const { error } = await supabase
          .from('top_students')
          .update(studentData)
          .eq('id', editingStudent.id);

        if (error) throw error;
        toast({ title: "Success", description: "Top student updated successfully" });
      } else {
        const { error } = await supabase
          .from('top_students')
          .insert(studentData);

        if (error) throw error;
        toast({ title: "Success", description: "Top student added successfully" });
      }

      setShowStudentDialog(false);
      setEditingStudent(null);
      resetStudentForm();
      fetchTopStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save top student",
        variant: "destructive"
      });
    }
  };

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const schoolData = {
        ...schoolForm,
        average_marks: parseFloat(schoolForm.average_marks),
        position: parseInt(schoolForm.position),
        total_students: parseInt(schoolForm.total_students),
        published_by: user.id
      };

      if (editingSchool) {
        const { error } = await supabase
          .from('best_schools')
          .update(schoolData)
          .eq('id', editingSchool.id);

        if (error) throw error;
        toast({ title: "Success", description: "Best school updated successfully" });
      } else {
        const { error } = await supabase
          .from('best_schools')
          .insert(schoolData);

        if (error) throw error;
        toast({ title: "Success", description: "Best school added successfully" });
      }

      setShowSchoolDialog(false);
      setEditingSchool(null);
      resetSchoolForm();
      fetchBestSchools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save best school",
        variant: "destructive"
      });
    }
  };

  const toggleStudentPublishStatus = async (student: TopStudent) => {
    try {
      const { error } = await supabase
        .from('top_students')
        .update({ is_published: !student.is_published })
        .eq('id', student.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Top student ${!student.is_published ? 'published' : 'unpublished'} successfully`
      });
      
      fetchTopStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update publish status",
        variant: "destructive"
      });
    }
  };

  const toggleSchoolPublishStatus = async (school: BestSchool) => {
    try {
      const { error } = await supabase
        .from('best_schools')
        .update({ is_published: !school.is_published })
        .eq('id', school.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Best school ${!school.is_published ? 'published' : 'unpublished'} successfully`
      });
      
      fetchBestSchools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update publish status",
        variant: "destructive"
      });
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkUploadData.trim()) {
      toast({
        title: "Error",
        description: "Please enter data to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Parse CSV data (assuming format: student_name,school_name,region,district,series,subject,marks,position)
      const lines = bulkUploadData.trim().split('\n');
      const studentsData = lines.map(line => {
        const [student_name, school_name, region, district, series_number, subject, marks, position] = line.split(',');
        return {
          student_name: student_name?.trim(),
          school_name: school_name?.trim(),
          region: region?.trim(),
          district: district?.trim(),
          series_number: parseInt(series_number?.trim()),
          subject: subject?.trim(),
          marks: parseInt(marks?.trim()),
          position: parseInt(position?.trim()),
          published_by: user.id,
          is_published: false
        };
      }).filter(student => student.student_name && student.school_name);

      if (studentsData.length === 0) {
        throw new Error('No valid student data found');
      }

      const { error } = await supabase
        .from('top_students')
        .insert(studentsData);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${studentsData.length} top students uploaded successfully`
      });

      setBulkUploadData('');
      fetchTopStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload bulk data",
        variant: "destructive"
      });
    }
  };

  const resetStudentForm = () => {
    setStudentForm({
      student_name: '',
      school_name: '',
      region: '',
      district: '',
      series_number: 1,
      subject: '',
      marks: '',
      position: '',
      is_published: false
    });
  };

  const resetSchoolForm = () => {
    setSchoolForm({
      school_name: '',
      region: '',
      district: '',
      series_number: 1,
      average_marks: '',
      position: '',
      total_students: '',
      is_published: false
    });
  };

  const openEditStudentDialog = (student: TopStudent) => {
    setEditingStudent(student);
    setStudentForm({
      student_name: student.student_name,
      school_name: student.school_name,
      region: student.region,
      district: student.district,
      series_number: student.series_number,
      subject: student.subject,
      marks: student.marks.toString(),
      position: student.position.toString(),
      is_published: student.is_published
    });
    setShowStudentDialog(true);
  };

  const openEditSchoolDialog = (school: BestSchool) => {
    setEditingSchool(school);
    setSchoolForm({
      school_name: school.school_name,
      region: school.region,
      district: school.district,
      series_number: school.series_number,
      average_marks: school.average_marks.toString(),
      position: school.position.toString(),
      total_students: school.total_students?.toString() || '',
      is_published: school.is_published
    });
    setShowSchoolDialog(true);
  };

  return (
    <div className="min-h-screen py-8 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Results Management System
          </h1>
          <p className="text-muted-foreground">
            Manage and publish top students and best schools for all series
          </p>
        </div>

        <Tabs defaultValue="top-students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="top-students">Top 10 Students</TabsTrigger>
            <TabsTrigger value="best-schools">Best Schools</TabsTrigger>
            <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
          </TabsList>

          {/* Top Students Tab */}
          <TabsContent value="top-students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Top 10 Students Management
                  </CardTitle>
                  <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
                    <DialogTrigger asChild>
                      <Button className="btn-educational" onClick={() => { resetStudentForm(); setEditingStudent(null); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Top Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingStudent ? 'Edit Top Student' : 'Add Top Student'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleStudentSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="student_name">Student Name *</Label>
                            <Input
                              value={studentForm.student_name}
                              onChange={(e) => setStudentForm({...studentForm, student_name: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="school_name">School Name *</Label>
                            <Input
                              value={studentForm.school_name}
                              onChange={(e) => setStudentForm({...studentForm, school_name: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="region">Region *</Label>
                            <Select value={studentForm.region} onValueChange={(value) => setStudentForm({...studentForm, region: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                              <SelectContent>
                                {tanzanianRegions.map((region) => (
                                  <SelectItem key={region} value={region}>{region}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="district">District *</Label>
                            <Input
                              value={studentForm.district}
                              onChange={(e) => setStudentForm({...studentForm, district: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor="series_number">Series</Label>
                            <Select value={studentForm.series_number.toString()} onValueChange={(value) => setStudentForm({...studentForm, series_number: parseInt(value)})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Series 1</SelectItem>
                                <SelectItem value="2">Series 2</SelectItem>
                                <SelectItem value="3">Series 3</SelectItem>
                                <SelectItem value="4">Series 4</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                              value={studentForm.subject}
                              onChange={(e) => setStudentForm({...studentForm, subject: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="marks">Marks *</Label>
                            <Input
                              type="number"
                              value={studentForm.marks}
                              onChange={(e) => setStudentForm({...studentForm, marks: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="position">Position *</Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={studentForm.position}
                              onChange={(e) => setStudentForm({...studentForm, position: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={studentForm.is_published}
                            onCheckedChange={(checked) => setStudentForm({...studentForm, is_published: checked})}
                          />
                          <Label>Publish immediately</Label>
                        </div>

                        <Button type="submit" className="w-full btn-educational">
                          {editingStudent ? 'Update Student' : 'Add Student'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading top students...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Position</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>School</TableHead>
                          <TableHead>Region</TableHead>
                          <TableHead>Series</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Marks</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <Badge variant="outline">#{student.position}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{student.student_name}</TableCell>
                            <TableCell>{student.school_name}</TableCell>
                            <TableCell>{student.region}</TableCell>
                            <TableCell>Series {student.series_number}</TableCell>
                            <TableCell>{student.subject}</TableCell>
                            <TableCell>{student.marks}%</TableCell>
                            <TableCell>
                            <Badge variant={student.is_published ? 'default' : 'secondary'}>
                              {student.is_published ? 'Published' : 'Draft'}
                            </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditStudentDialog(student)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Switch
                                  checked={student.is_published}
                                  onCheckedChange={() => toggleStudentPublishStatus(student)}
                                />
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
          </TabsContent>

          {/* Best Schools Tab */}
          <TabsContent value="best-schools">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <School className="h-5 w-5 mr-2" />
                    Best Schools Management
                  </CardTitle>
                  <Dialog open={showSchoolDialog} onOpenChange={setShowSchoolDialog}>
                    <DialogTrigger asChild>
                      <Button className="btn-educational" onClick={() => { resetSchoolForm(); setEditingSchool(null); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Best School
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingSchool ? 'Edit Best School' : 'Add Best School'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSchoolSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="school_name">School Name *</Label>
                            <Input
                              value={schoolForm.school_name}
                              onChange={(e) => setSchoolForm({...schoolForm, school_name: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="region">Region *</Label>
                            <Select value={schoolForm.region} onValueChange={(value) => setSchoolForm({...schoolForm, region: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                              <SelectContent>
                                {tanzanianRegions.map((region) => (
                                  <SelectItem key={region} value={region}>{region}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="district">District *</Label>
                            <Input
                              value={schoolForm.district}
                              onChange={(e) => setSchoolForm({...schoolForm, district: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="series_number">Series</Label>
                            <Select value={schoolForm.series_number.toString()} onValueChange={(value) => setSchoolForm({...schoolForm, series_number: parseInt(value)})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Series 1</SelectItem>
                                <SelectItem value="2">Series 2</SelectItem>
                                <SelectItem value="3">Series 3</SelectItem>
                                <SelectItem value="4">Series 4</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="average_marks">Average Marks *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={schoolForm.average_marks}
                              onChange={(e) => setSchoolForm({...schoolForm, average_marks: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="position">Position *</Label>
                            <Input
                              type="number"
                              min="1"
                              value={schoolForm.position}
                              onChange={(e) => setSchoolForm({...schoolForm, position: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="total_students">Total Students</Label>
                            <Input
                              type="number"
                              value={schoolForm.total_students}
                              onChange={(e) => setSchoolForm({...schoolForm, total_students: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={schoolForm.is_published}
                            onCheckedChange={(checked) => setSchoolForm({...schoolForm, is_published: checked})}
                          />
                          <Label>Publish immediately</Label>
                        </div>

                        <Button type="submit" className="w-full btn-educational">
                          {editingSchool ? 'Update School' : 'Add School'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>School Name</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>Series</TableHead>
                        <TableHead>Average Marks</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bestSchools.map((school) => (
                        <TableRow key={school.id}>
                          <TableCell>
                            <Badge variant="outline">#{school.position}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{school.school_name}</TableCell>
                          <TableCell>{school.region}</TableCell>
                          <TableCell>{school.district}</TableCell>
                          <TableCell>Series {school.series_number}</TableCell>
                          <TableCell>{school.average_marks}%</TableCell>
                          <TableCell>{school.total_students || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={school.is_published ? 'default' : 'secondary'}>
                              {school.is_published ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditSchoolDialog(school)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Switch
                                checked={school.is_published}
                                onCheckedChange={() => toggleSchoolPublishStatus(school)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulk Upload Tab */}
          <TabsContent value="bulk-upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Bulk Upload Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">CSV Format Instructions:</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Enter data in CSV format (one student per line):
                  </p>
                  <code className="text-xs bg-background p-2 rounded block">
                    student_name,school_name,region,district,series_number,subject,marks,position
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example: John Doe,ABC Secondary,Dar es Salaam,Kinondoni,1,Geography,95,1
                  </p>
                </div>

                <div>
                  <Label htmlFor="bulk_data">Paste CSV Data:</Label>
                  <Textarea
                    value={bulkUploadData}
                    onChange={(e) => setBulkUploadData(e.target.value)}
                    placeholder="student_name,school_name,region,district,series_number,subject,marks,position&#10;John Doe,ABC Secondary,Dar es Salaam,Kinondoni,1,Geography,95,1&#10;Jane Smith,XYZ School,Mwanza,Ilemela,1,History,94,2"
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleBulkUpload} className="btn-educational">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Data
                  </Button>
                  <Button variant="outline" onClick={() => setBulkUploadData('')}>
                    Clear Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResultsManagementPage;