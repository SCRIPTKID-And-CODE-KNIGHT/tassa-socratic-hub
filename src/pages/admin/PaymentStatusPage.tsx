import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, Plus, Edit, Search, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentStatus {
  id: string;
  school_id?: string;
  school_name: string;
  region: string;
  district: string;
  series_number: number;
  amount: number;
  payment_date: string | null;
  payment_method: string | null;
  status: string;
  receipt_number: string | null;
  notes: string | null;
}

const PaymentStatusPage = () => {
  const [payments, setPayments] = useState<PaymentStatus[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentStatus | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    school_id: '',
    series_number: 1,
    amount: '',
    payment_date: '',
    payment_method: '',
    status: 'pending',
    receipt_number: '',
    notes: ''
  });

  useEffect(() => {
    checkAuth();
    fetchPayments();
    fetchSchools();
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

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_status')
        .select(`
          *,
          schools (
            school_name,
            region,
            district
          )
        `);

      if (error) throw error;
      
      const formattedData = data?.map(payment => ({
        ...payment,
        school_name: payment.schools?.school_name || 'Unknown School',
        region: payment.schools?.region || 'Unknown Region',
        district: payment.schools?.district || 'Unknown District'
      })) || [];

      setPayments(formattedData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('school_name');

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date || null,
        payment_method: formData.payment_method || null,
        receipt_number: formData.receipt_number || null,
        notes: formData.notes || null
      };

      if (editingPayment) {
        const { error } = await supabase
          .from('payment_status')
          .update(paymentData)
          .eq('id', editingPayment.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Payment status updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('payment_status')
          .insert(paymentData);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Payment status added successfully"
        });
      }

      setShowAddDialog(false);
      setEditingPayment(null);
      resetForm();
      fetchPayments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save payment status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      school_id: '',
      series_number: 1,
      amount: '',
      payment_date: '',
      payment_method: '',
      status: 'pending',
      receipt_number: '',
      notes: ''
    });
  };

  const openEditDialog = (payment: PaymentStatus) => {
    setEditingPayment(payment);
    setFormData({
      school_id: payment.school_id || '',
      series_number: payment.series_number,
      amount: payment.amount?.toString() || '',
      payment_date: payment.payment_date || '',
      payment_method: payment.payment_method || '',
      status: payment.status,
      receipt_number: payment.receipt_number || '',
      notes: payment.notes || ''
    });
    setShowAddDialog(true);
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'partial': return 'outline';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeries = selectedSeries === 'all' || payment.series_number.toString() === selectedSeries;
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    return matchesSearch && matchesSeries && matchesStatus;
  });

  return (
    <div className="min-h-screen py-8 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Payment Status Management
            </h1>
            <p className="text-muted-foreground">
              Manage school payment status for Series 1-4
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="btn-educational" onClick={() => { resetForm(); setEditingPayment(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPayment ? 'Edit Payment Status' : 'Add Payment Status'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="school_id">School</Label>
                  <Select value={formData.school_id} onValueChange={(value) => setFormData({...formData, school_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.school_name} - {school.region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="series_number">Series Number</Label>
                  <Select value={formData.series_number.toString()} onValueChange={(value) => setFormData({...formData, series_number: parseInt(value)})}>
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
                  <Label htmlFor="amount">Amount (TZS)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payment_date">Payment Date</Label>
                  <Input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Input
                    value={formData.payment_method}
                    onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                    placeholder="e.g., Bank Transfer, M-Pesa"
                  />
                </div>

                <div>
                  <Label htmlFor="receipt_number">Receipt Number</Label>
                  <Input
                    value={formData.receipt_number}
                    onChange={(e) => setFormData({...formData, receipt_number: e.target.value})}
                    placeholder="Receipt/Reference number"
                  />
                </div>

                <Button type="submit" className="w-full btn-educational">
                  {editingPayment ? 'Update Payment' : 'Add Payment'}
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
                  placeholder="Search schools, regions, or districts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Series" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Series</SelectItem>
                  <SelectItem value="1">Series 1</SelectItem>
                  <SelectItem value="2">Series 2</SelectItem>
                  <SelectItem value="3">Series 3</SelectItem>
                  <SelectItem value="4">Series 4</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              School Payment Status ({filteredPayments.length} records)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading payment data...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Series</TableHead>
                      <TableHead>Amount (TZS)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.school_name}</TableCell>
                        <TableCell>{payment.region}</TableCell>
                        <TableCell>{payment.district}</TableCell>
                        <TableCell>Series {payment.series_number}</TableCell>
                        <TableCell>{payment.amount ? `TZS ${payment.amount.toLocaleString()}` : '-'}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(payment.status)}>
                            {payment.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.payment_date || '-'}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(payment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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

export default PaymentStatusPage;