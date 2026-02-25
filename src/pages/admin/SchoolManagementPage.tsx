import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, Search, Edit, DollarSign, School } from 'lucide-react';

interface SchoolData {
  id: string;
  school_name: string;
  contact_name: string;
  phone_number: string;
  email: string | null;
  region: string;
  district: string;
  message: string | null;
  created_at: string;
}

interface PaymentStatus {
  id: string;
  school_id: string;
  series_number: number;
  status: string;
  amount: number | null;
  payment_date: string | null;
}

const SchoolManagementPage = () => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [payments, setPayments] = useState<PaymentStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    school_name: '',
    contact_name: '',
    phone_number: '',
    email: '',
    region: '',
    district: '',
    message: ''
  });

  const [paymentFormData, setPaymentFormData] = useState({
    series_number: '6',
    status: 'pending',
    amount: '',
    payment_date: '',
    payment_method: '',
    receipt_number: '',
    notes: ''
  });

  useEffect(() => {
    checkAuth();
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
        description: "Admin privileges required.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    fetchData();
  };

  const fetchData = async () => {
    setIsLoading(true);
    
    const [schoolsRes, paymentsRes] = await Promise.all([
      supabase.from('schools').select('*').order('created_at', { ascending: false }),
      supabase.from('payment_status').select('*')
    ]);

    if (schoolsRes.data) setSchools(schoolsRes.data);
    if (paymentsRes.data) setPayments(paymentsRes.data);
    
    setIsLoading(false);
  };

  const handleAddSchool = async () => {
    if (!formData.school_name || !formData.contact_name || !formData.phone_number || !formData.region || !formData.district) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode && selectedSchool) {
      const { error } = await supabase
        .from('schools')
        .update({
          school_name: formData.school_name,
          contact_name: formData.contact_name,
          phone_number: formData.phone_number,
          email: formData.email || null,
          region: formData.region,
          district: formData.district,
          message: formData.message || null
        })
        .eq('id', selectedSchool.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update school.",
          variant: "destructive"
        });
        return;
      }

      toast({ title: "Success", description: "School updated successfully." });
    } else {
      const { error } = await supabase
        .from('schools')
        .insert({
          school_name: formData.school_name,
          contact_name: formData.contact_name,
          phone_number: formData.phone_number,
          email: formData.email || null,
          region: formData.region,
          district: formData.district,
          message: formData.message || null
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add school.",
          variant: "destructive"
        });
        return;
      }

      toast({ title: "Success", description: "School added successfully." });
    }

    resetForm();
    setIsAddDialogOpen(false);
    fetchData();
  };

  const handleUpdatePayment = async () => {
    if (!selectedSchool) return;

    const existingPayment = payments.find(
      p => p.school_id === selectedSchool.id && p.series_number === parseInt(paymentFormData.series_number)
    );

    const paymentData = {
      school_id: selectedSchool.id,
      series_number: parseInt(paymentFormData.series_number),
      status: paymentFormData.status,
      amount: paymentFormData.amount ? parseFloat(paymentFormData.amount) : null,
      payment_date: paymentFormData.payment_date || null,
      payment_method: paymentFormData.payment_method || null,
      receipt_number: paymentFormData.receipt_number || null,
      notes: paymentFormData.notes || null
    };

    if (existingPayment) {
      const { error } = await supabase
        .from('payment_status')
        .update(paymentData)
        .eq('id', existingPayment.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update payment.", variant: "destructive" });
        return;
      }
    } else {
      const { error } = await supabase
        .from('payment_status')
        .insert(paymentData);

      if (error) {
        toast({ title: "Error", description: "Failed to add payment.", variant: "destructive" });
        return;
      }
    }

    toast({ title: "Success", description: "Payment status updated." });
    setIsPaymentDialogOpen(false);
    resetPaymentForm();
    fetchData();
  };

  const resetForm = () => {
    setFormData({
      school_name: '',
      contact_name: '',
      phone_number: '',
      email: '',
      region: '',
      district: '',
      message: ''
    });
    setSelectedSchool(null);
    setIsEditMode(false);
  };

  const resetPaymentForm = () => {
    setPaymentFormData({
      series_number: '6',
      status: 'pending',
      amount: '',
      payment_date: '',
      payment_method: '',
      receipt_number: '',
      notes: ''
    });
    setSelectedSchool(null);
  };

  const openEditDialog = (school: SchoolData) => {
    setSelectedSchool(school);
    setFormData({
      school_name: school.school_name,
      contact_name: school.contact_name,
      phone_number: school.phone_number,
      email: school.email || '',
      region: school.region,
      district: school.district,
      message: school.message || ''
    });
    setIsEditMode(true);
    setIsAddDialogOpen(true);
  };

  const openPaymentDialog = (school: SchoolData) => {
    setSelectedSchool(school);
    
    // Check if payment exists for series 6
    const existingPayment = payments.find(
      p => p.school_id === school.id && p.series_number === 6
    );
    
    if (existingPayment) {
      setPaymentFormData({
        series_number: existingPayment.series_number.toString(),
        status: existingPayment.status || 'pending',
        amount: existingPayment.amount?.toString() || '',
        payment_date: existingPayment.payment_date || '',
        payment_method: '',
        receipt_number: '',
        notes: ''
      });
    }
    
    setIsPaymentDialogOpen(true);
  };

  const getPaymentStatus = (schoolId: string, seriesNumber: number) => {
    const payment = payments.find(p => p.school_id === schoolId && p.series_number === seriesNumber);
    return payment?.status || 'not set';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredSchools = schools.filter(school =>
    school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 bg-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Admin</span>
        </Button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              School Management
            </h1>
            <p className="text-muted-foreground">
              View, add, and manage registered schools ({schools.length} total)
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="btn-educational flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add School</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditMode ? 'Edit School' : 'Add New School'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="school_name">School Name *</Label>
                  <Input
                    id="school_name"
                    value={formData.school_name}
                    onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_name">Contact Person *</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number *</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region *</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Enter region"
                  />
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Enter district"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Notes</Label>
                  <Input
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
                <Button onClick={handleAddSchool} className="w-full btn-educational">
                  {isEditMode ? 'Update School' : 'Add School'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={(open) => {
          setIsPaymentDialogOpen(open);
          if (!open) resetPaymentForm();
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Payment Status</DialogTitle>
              {selectedSchool && (
                <p className="text-sm text-muted-foreground">{selectedSchool.school_name}</p>
              )}
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Series Number</Label>
                <Select
                  value={paymentFormData.series_number}
                  onValueChange={(value) => setPaymentFormData({ ...paymentFormData, series_number: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>Series {num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Status</Label>
                <Select
                  value={paymentFormData.status}
                  onValueChange={(value) => setPaymentFormData({ ...paymentFormData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount (TZS)</Label>
                <Input
                  type="number"
                  value={paymentFormData.amount}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={paymentFormData.payment_date}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, payment_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Input
                  value={paymentFormData.payment_method}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, payment_method: e.target.value })}
                  placeholder="e.g., M-Pesa, Bank Transfer"
                />
              </div>
              <div>
                <Label>Receipt Number</Label>
                <Input
                  value={paymentFormData.receipt_number}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, receipt_number: e.target.value })}
                  placeholder="Enter receipt number"
                />
              </div>
              <Button onClick={handleUpdatePayment} className="w-full btn-educational">
                Update Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by school name, region, district, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Schools Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <School className="h-5 w-5 text-primary" />
              <span>Registered Schools</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Series 6 Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.school_name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{school.contact_name}</p>
                          <p className="text-xs text-muted-foreground">{school.phone_number}</p>
                        </div>
                      </TableCell>
                      <TableCell>{school.region}</TableCell>
                      <TableCell>{school.district}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(getPaymentStatus(school.id, 5))}>
                          {getPaymentStatus(school.id, 5)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(school)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPaymentDialog(school)}
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredSchools.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No schools found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolManagementPage;
