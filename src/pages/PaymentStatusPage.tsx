import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, Search, School, CreditCard, Calendar, Receipt } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentRecord {
  id: string;
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
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      fetchPaymentsBySchool(selectedSchool);
    }
  }, [selectedSchool]);

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

  const fetchPaymentsBySchool = async (schoolId: string) => {
    setIsLoading(true);
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
        `)
        .eq('school_id', schoolId);

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
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchSchoolsAndFetch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_status')
        .select(`
          *,
          schools!inner (
            school_name,
            region,
            district
          )
        `)
        .ilike('schools.school_name', `%${searchTerm}%`);

      if (error) throw error;
      
      const formattedData = data?.map(payment => ({
        ...payment,
        school_name: payment.schools?.school_name || 'Unknown School',
        region: payment.schools?.region || 'Unknown Region',
        district: payment.schools?.district || 'Unknown District'
      })) || [];

      setPayments(formattedData);
    } catch (error) {
      console.error('Error searching payments:', error);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchSchoolsAndFetch();
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'partial': return 'outline';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'partial': return 'text-blue-600';
      case 'overdue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSeries = selectedSeries === 'all' || payment.series_number.toString() === selectedSeries;
    return matchesSeries;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const paidAmount = filteredPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            School Payment Status
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Check your school's payment status for TASSA Socratic Series. 
            Select your school or search by name to view payment history.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Find Your School's Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* School Selection */}
              <div>
                <Label htmlFor="school_select">Select Your School</Label>
                <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose your school from the list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Select School --</SelectItem>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.school_name} - {school.region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search by Name */}
              <div>
                <Label htmlFor="search_school">Or Search by School Name</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="search_school"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type school name and press Enter"
                  />
                </div>
              </div>
            </div>

            {/* Series Filter */}
            {payments.length > 0 && (
              <div className="flex items-center gap-4">
                <Label>Filter by Series:</Label>
                <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Series</SelectItem>
                    <SelectItem value="1">Series 1</SelectItem>
                    <SelectItem value="2">Series 2</SelectItem>
                    <SelectItem value="3">Series 3</SelectItem>
                    <SelectItem value="4">Series 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        {filteredPayments.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">TZS {totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
                    <p className="text-2xl font-bold text-green-600">TZS {paidAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Receipt className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                    <p className="text-2xl font-bold text-red-600">TZS {(totalAmount - paidAmount).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <School className="h-5 w-5 mr-2" />
              Payment Records
              {filteredPayments.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filteredPayments.length} records)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading payment information...</p>
              </div>
            ) : filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Series</TableHead>
                      <TableHead>Amount (TZS)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.school_name}</TableCell>
                        <TableCell>{payment.region}</TableCell>
                        <TableCell>Series {payment.series_number}</TableCell>
                        <TableCell className="font-semibold">
                          {payment.amount ? `TZS ${payment.amount.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusBadgeVariant(payment.status) as any}
                            className={getStatusColor(payment.status)}
                          >
                            {payment.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.payment_date || 'Not paid'}</TableCell>
                        <TableCell>{payment.payment_method || '-'}</TableCell>
                        <TableCell>{payment.receipt_number || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payment Records Found</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedSchool || searchTerm 
                    ? 'No payment records found for the selected school.'
                    : 'Please select your school or search by school name to view payment status.'}
                </p>
                {!selectedSchool && !searchTerm && (
                  <Alert className="mt-4">
                    <School className="h-4 w-4" />
                    <AlertDescription>
                      <strong>How to check your payment status:</strong>
                      <br />
                      1. Select your school from the dropdown above, OR
                      <br />
                      2. Type your school name in the search box and press Enter
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Status Guide */}
        <Card className="mt-8 border-primary/20 bg-primary-light/10">
          <CardHeader>
            <CardTitle className="text-center">Payment Status Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <Badge variant="default" className="mb-2">PAID</Badge>
                <p className="text-muted-foreground">Payment completed successfully</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">PENDING</Badge>
                <p className="text-muted-foreground">Payment is being processed</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">PARTIAL</Badge>
                <p className="text-muted-foreground">Partial payment received</p>
              </div>
              <div className="text-center">
                <Badge variant="destructive" className="mb-2">OVERDUE</Badge>
                <p className="text-muted-foreground">Payment is past due date</p>
              </div>
            </div>
            
            <Alert className="mt-6">
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Need help with payments?</strong> Contact TASSA administration at coordinator@tassa.ac.tz 
                or call +255 757 123 456 for payment assistance and inquiries.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentStatusPage;