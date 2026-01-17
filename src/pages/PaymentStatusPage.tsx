import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { School, Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentData {
  id: string;
  school_name: string;
  region: string;
  district: string;
  series_number: number;
  status: string;
}

const PaymentStatusPage = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [seriesFilter, setSeriesFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_status')
        .select(`
          id,
          series_number,
          status,
          schools (
            school_name,
            region,
            district
          )
        `)
        .order('series_number', { ascending: false });

      if (error) throw error;

      const formattedData: PaymentData[] = (data || []).map((item: any) => ({
        id: item.id,
        school_name: item.schools?.school_name || 'Unknown School',
        region: item.schools?.region || '',
        district: item.schools?.district || '',
        series_number: item.series_number,
        status: item.status || 'pending',
      }));

      setPayments(formattedData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Paid</Badge>;
      case 'demanded':
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Demanded</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">Not Paid</Badge>;
    }
  };

  const uniqueSeries = [...new Set(payments.map(p => p.series_number))].sort((a, b) => b - a);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || payment.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesSeries =
      seriesFilter === 'all' || payment.series_number.toString() === seriesFilter;

    return matchesSearch && matchesStatus && matchesSeries;
  });

  const stats = {
    total: filteredPayments.length,
    paid: filteredPayments.filter(p => p.status?.toLowerCase() === 'paid').length,
    demanded: filteredPayments.filter(p => p.status?.toLowerCase() === 'demanded').length,
    notPaid: filteredPayments.filter(p => !p.status || p.status?.toLowerCase() === 'pending').length,
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <School className="h-8 w-8 text-primary" />
            Payment Status
          </h1>
          <p className="text-muted-foreground mt-2">
            View payment status for all registered schools
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
              <div className="text-sm text-muted-foreground">Paid</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.demanded}</div>
              <div className="text-sm text-muted-foreground">Demanded</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.notPaid}</div>
              <div className="text-sm text-muted-foreground">Not Paid</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by school, region, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={seriesFilter} onValueChange={setSeriesFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Series" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Series</SelectItem>
                  {uniqueSeries.map((series) => (
                    <SelectItem key={series} value={series.toString()}>
                      Series {series}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="demanded">Demanded</SelectItem>
                  <SelectItem value="pending">Not Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Schools Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No payment records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>School Name</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Series</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment, index) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{payment.school_name}</TableCell>
                        <TableCell>{payment.region}</TableCell>
                        <TableCell>{payment.district}</TableCell>
                        <TableCell>Series {payment.series_number}</TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(payment.status)}
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
