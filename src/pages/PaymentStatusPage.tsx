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

  // Updated schools list (deduplicated & cleaned)
  const schools = [
    { name: 'Kakubilo Secondary School', status: 'Pending' },
    { name: 'Jenerali David Msuguli Secondary School', status: 'Pending' },
    { name: 'Kyerwa Modern High School', status: 'Pending' },
    { name: 'Rutabo Secondary School', status: 'Pending' },
    { name: 'Kaigara Secondary School', status: 'Pending' },
    { name: 'Minziro Secondary School', status: 'Pending' },
    { name: 'Korona High School', status: 'Pending' },
    { name: 'Carmel Mount Girls Secondary School', status: 'Pending' },
    { name: 'Mpemba High School', status: 'Pending' },
    { name: 'High View School of Zanzibar', status: 'Pending' },
    { name: 'Nyerere High School Migoli', status: 'Pending' },
    { name: 'Muungano Boys Secondary School', status: 'Pending' },
    { name: 'Chato Technical Secondary School', status: 'Pending' },
    { name: 'Geita Secondary School', status: 'Pending' },
    { name: 'Janeth Magufuli Girls Secondary School', status: 'Pending' },
    { name: 'Twihulumile High School', status: 'Pending' },
    { name: 'Bukama Secondary School', status: 'Pending' },
    { name: 'Ziba Secondary School', status: 'Pending' },
    { name: 'Nyabusozi Secondary School', status: 'Pending' },
    { name: 'Nanga High School', status: 'Pending' },
    { name: 'Kabanga Secondary School', status: 'Pending' },
    { name: 'Marian Boys’ High School', status: 'Pending' },
    { name: 'Mwisi Secondary School', status: 'Pending' },
    { name: 'Natta High School', status: 'Pending' },
    { name: 'Tukuyu High School', status: 'Pending' },
    { name: 'Laureate Secondary School', status: 'Pending' },
    { name: 'Maswa Girls Secondary School', status: 'Pending' },
    { name: 'Kagango Secondary School', status: 'Pending' },
    { name: 'Jikomboe Girls High School', status: 'Pending' },
    { name: 'Tosamaganga Secondary School', status: 'Pending' },
    { name: 'Dr. Samia Suluhu Hassan Secondary School', status: 'Pending' },
    { name: 'Rubya Seminary', status: 'Pending' },
    { name: 'Arusha Science Secondary School', status: 'Pending' },
    { name: 'Lucas Mlia Girls High School', status: 'Pending' },
    { name: 'Dr Olsen Secondary School', status: 'Pending' },
    { name: 'Old Shinyanga Secondary School', status: 'Pending' },
    { name: 'Mulbadaw High School', status: 'Pending' },
    { name: 'Beroya Secondary School', status: 'Pending' }
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
