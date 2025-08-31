import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { School } from 'lucide-react';

const PaymentStatusPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');

  // Schools list, all with Pending status
  const schools = [
    'Beroya SS',
    'Twiwhulumile SS',
    'Tukuyu SS',
    'Tosamaganga SS',
    'Nyankumanga Girls SS',
    'Nyabusozi SS',
    'Old Shinyanga SS',
    'Nata High School',
    'Mwatulole SS',
    'Arusha Science SS',
    'Mpemba High School',
    'Lucas Maria High School',
    'Korona High School',
    'Kagango SS',
    'Jikomboe Girls High School',
    'Chato SS',
    'High View School of Zanzibar',
    'Rubya Seminary',
    'Dr Olsen',
    'Mwisi SS',
    'Bukama SS',
    'Carmel Mount Girls SS',
    'Golden Ridge SS',
    'Mulbadaw SS',
    'Maswa SS'
  ].map(name => ({ name, status: 'Pending' })); // All Pending

  const schoolData = schools.find(s => s.name === selectedSchool);

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
      <h1 className="text-3xl font-bold mb-6 text-foreground">Payment Status - Upcoming Series</h1>

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
            <h3 className="text-lg font-semibold mb-4">{selectedSchool}</h3>
            <Badge className={`px-4 py-2 text-sm ${getBadgeColor(schoolData.status)}`}>
              {schoolData.status}
            </Badge>
            <p className="mt-4 text-muted-foreground text-sm">
              School has not completed payment yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentStatusPage;
