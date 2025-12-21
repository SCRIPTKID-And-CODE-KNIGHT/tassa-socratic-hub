import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { School } from 'lucide-react';

const PaymentStatusPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');

  // Schools list with mixed statuses
  const schools = [
    { name: 'Beroya SS', status: 'Pending' },
    { name: 'Twihulumile SS', status: 'Paid' },
    { name: 'Tukuyu SS', status: 'Pending' },
    { name: 'Tosamaganga SS', status: 'Paid' },
    { name: 'Nyankumbu Girls SS', status: 'Pending' },
    { name: 'Nyabusozi SS', status: 'Pending' },
    { name: 'Old Shinyanga SS', status: 'Paid' },
    { name: 'Nata High School', status: 'Pending' },
    { name: 'Mwatulole SS', status: 'Pending' },
    { name: 'Arusha Science SS', status: 'Paid' },
    { name: 'Mpemba High School', status: 'Paid' },
    { name: 'Lucas Maria High School', status: 'Pending' },
    { name: 'Korona High School', status: 'Paid' },
    { name: 'Kagango SS', status: 'Paid' },
    { name: 'Jikomboe Girls High School', status: 'Paid' },
    { name: 'Chato SS', status: 'Paid' },
    { name: 'High View School of Zanzibar', status: 'Pending' },
    { name: 'Rubya Seminary', status: 'Pending' },
    { name: 'Dr Olsen', status: 'Pending' },
    { name: 'Mwisi SS', status: 'Pending' },
    { name: 'Bukama SS', status: 'Pending' },
    { name: 'Carmel Mount Girls SS', status: 'Pending' },
    { name: 'Golden Ridge SS', status: 'Pending' },
    { name: 'Mulbadaw SS', status: 'Pending' },
    { name: 'Maswa SS', status: 'Pending' }
  ];

  const schoolData = schools.find(
    (school) => school.name === selectedSchool
  );

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

  return (
    <div className="min-h-screen py-8 flex flex-col items-center justify-start">
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
              {schools.map((school) => (
                <SelectItem key={school.name} value={school.name}>
                  {school.name}
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
              {selectedSchool}
            </h3>

            <Badge
              className={`px-4 py-2 text-sm ${getBadgeColor(
                schoolData.status
              )}`}
            >
              {schoolData.status}
            </Badge>

            <p className="mt-4 text-muted-foreground text-sm">
              {schoolData.status === 'Paid'
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
