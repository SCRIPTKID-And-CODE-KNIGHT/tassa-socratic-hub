import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { School } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SchoolData {
  id: string;
  school_name: string;
  payment_status: string;
}

const PaymentStatusPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, school_name, payment_status')
        .order('school_name');

      if (error) throw error;

      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const schoolData = schools.find(s => s.school_name === selectedSchool);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500 text-white';
      case 'Confirmed':
        return 'bg-blue-500 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading payment status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Payment Status - Upcoming Series
      </h1>

      {/* School Selection */}
      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <School className="h-5 w-5 text-primary" />
            <span>Select School</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger>
              <SelectValue placeholder="Choose school..." />
            </SelectTrigger>
            <SelectContent>
              {schools.map(school => (
                <SelectItem key={school.id} value={school.school_name}>
                  {school.school_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Payment Status Display */}
      {selectedSchool && schoolData && (
        <Card className="text-center py-12 w-full max-w-md">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">
              {schoolData.school_name}
            </h3>
            <Badge className={`px-4 py-2 text-sm ${getBadgeColor(schoolData.payment_status)}`}>
              {schoolData.payment_status}
            </Badge>
            <p className="mt-4 text-muted-foreground text-sm">
              {schoolData.payment_status === 'Paid'
                ? 'School has completed payment.'
                : 'School has not completed payment yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentStatusPage;
