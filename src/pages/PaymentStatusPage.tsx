import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { School, Search, Loader2, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SchoolPayment {
  id: string;
  school_name: string;
  region: string;
  district: string;
  status: string;
  series_number: number | null;
}

const PaymentStatusPage = () => {
  const [schools, setSchools] = useState<SchoolPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSchoolsWithPayments();
  }, []);

  const fetchSchoolsWithPayments = async () => {
    try {
      // Fetch all schools
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('id, school_name, region, district')
        .order('school_name');

      if (schoolsError) throw schoolsError;

      // Fetch latest payment status for each school (series 6)
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payment_status')
        .select('school_id, status, series_number')
        .eq('series_number', 6);

      if (paymentsError) throw paymentsError;

      const paymentMap = new Map<string, { status: string; series_number: number }>();
      (paymentsData || []).forEach((p: any) => {
        paymentMap.set(p.school_id, { status: p.status || 'pending', series_number: p.series_number });
      });

      const combined: SchoolPayment[] = (schoolsData || []).map((school: any) => {
        const payment = paymentMap.get(school.id);
        return {
          id: school.id,
          school_name: school.school_name,
          region: school.region,
          district: school.district,
          status: payment?.status || 'pending',
          series_number: payment?.series_number || null,
        };
      });

      setSchools(combined);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1">Paid</Badge>;
      case 'demanded':
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1">Demanded</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1">Not Paid</Badge>;
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'border-l-4 border-l-emerald-500';
      case 'demanded':
        return 'border-l-4 border-l-orange-500';
      default:
        return 'border-l-4 border-l-red-500';
    }
  };

  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || school.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: schools.length,
    paid: schools.filter(s => s.status?.toLowerCase() === 'paid').length,
    demanded: schools.filter(s => s.status?.toLowerCase() === 'demanded').length,
    notPaid: schools.filter(s => !s.status || s.status?.toLowerCase() === 'pending').length,
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <School className="h-8 w-8 text-primary" />
            Payment Status - Series 6
          </h1>
          <p className="text-muted-foreground mt-2">
            Payment status for all registered schools
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Schools</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.paid}</div>
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
              <div className="text-2xl font-bold text-red-600">{stats.notPaid}</div>
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

        {/* Schools Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No schools found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.map((school) => (
              <Card key={school.id} className={`${getStatusBorder(school.status)} hover:shadow-md transition-shadow`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-sm leading-tight flex-1 mr-2">
                      {school.school_name}
                    </h3>
                    {getStatusBadge(school.status)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{school.district}, {school.region}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Showing {filteredSchools.length} of {schools.length} schools
        </p>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
