import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { School, Archive } from 'lucide-react';

const SchoolsResultsPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');

  // List of schools
  const schools = [
    'CHATO TECH SS',
    'RUBYA SEMINARY',
    'KAGANGO SS',
    'CAMEL MOUNT GIRLS',
    'MUUNGANO BOYS',
    'JANETH MAGUFULI HIGH SCHOOL',
    'NATA HIGH SCHOOL',
    'MALBADAW SS',
    'NYANKUMBU SS',
    'LAUREATE SCHOOL OF ZANZIBAR',
    'MASWA GIRLS',
    'ARUSHA SCIENCE'
  ];

  return (
    <div className="min-h-screen py-8 flex flex-col items-center justify-start">
      <h1 className="text-3xl font-bold mb-6 text-foreground">TASSA Results System</h1>

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
                <SelectItem key={school} value={school}>
                  {school}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* No results message */}
      {selectedSchool && (
        <Card className="text-center py-12 w-full max-w-md">
          <CardContent>
            <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{selectedSchool}</h3>
            <p className="text-muted-foreground">
              No results have been released for this school yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SchoolsResultsPage;        
