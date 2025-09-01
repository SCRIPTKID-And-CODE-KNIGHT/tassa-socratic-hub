import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { School, Archive } from 'lucide-react';

const SchoolsResultsPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');

  // Updated list of schools
  const schools = [
    'Beroya SS',
    'Twihulumile SS',
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
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start">
      <h1 className="text-3xl font-bold mb-6 text-foreground">TASSA Results System</h1>

      {/* School Selection */}
      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <School className="h-5 w-5 text-primary" />
            <span>Select School</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Select
            value={selectedSchool}
            onValueChange={setSelectedSchool}
            aria-label="Select a school"
          >
            <SelectTrigger aria-label="School selection">
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
          {selectedSchool && (
            <button
              onClick={() => setSelectedSchool('')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Clear
            </button>
          )}
        </CardContent>
      </Card>

      {/* No School Selected */}
      {!selectedSchool && (
        <Card className="text-center py-12 w-full max-w-md">
          <CardContent>
            <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Please select a school to view results.
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Results Message */}
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
