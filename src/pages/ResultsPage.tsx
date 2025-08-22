import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapPin, School, Download } from 'lucide-react';

const ResultsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');

  // Sample data
  const regions = [
    'Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 'Tanga', 'Morogoro', 'Kagera'
  ];

  const getDistricts = (region: string) => {
    const districtMap: { [key: string]: string[] } = {
      'Dar es Salaam': ['Kinondoni', 'Ilala', 'Temeke', 'Ubungo', 'Kigamboni'],
      'Arusha': ['Arusha City', 'Arusha Rural', 'Karatu', 'Monduli', 'Ngorongoro'],
      'Mwanza': ['Nyamagana', 'Ilemela', 'Magu', 'Sengerema', 'Kwimba'],
      'Dodoma': ['Dodoma Urban', 'Dodoma Rural', 'Kongwa', 'Mpwapwa', 'Bahi'],
    };
    return districtMap[region] || [];
  };

  const getSchools = (district: string) => {
    const schoolMap: { [key: string]: string[] } = {
      'Kinondoni': ['Azania Secondary School', 'Makongo Secondary School', 'Mwalimu Nyerere Secondary'],
      'Ilala': ['Benjamin Mkapa Secondary', 'Kibasila Secondary School', 'Gerezani Secondary School'],
      'Arusha City': ['Arusha Technical Secondary', 'Mount Meru Secondary', 'Nelson Mandela Secondary'],
      'Nyamagana': ['Lake Victoria Secondary', 'Mwanza Girls Secondary', 'Buzuruga Secondary School'],
    };
    return schoolMap[district] || [];
  };

  // Sample student results
  const sampleResults = [
    { name: 'ALLY, John Mwalimu', indexNo: 'S0234/0001/2024', grade: 'A', total: 87 },
    { name: 'HASSAN, Amina Said', indexNo: 'S0234/0002/2024', grade: 'A', total: 85 },
    { name: 'MWALIMU, Peter Joseph', indexNo: 'S0234/0003/2024', grade: 'B+', total: 78 },
    { name: 'NDOVU, Grace William', indexNo: 'S0234/0004/2024', grade: 'B', total: 72 },
    { name: 'SIMBA, Daniel Emmanuel', indexNo: 'S0234/0005/2024', grade: 'B', total: 69 },
  ];

  const getGradeClass = (grade: string) => {
    switch (grade) {
      case 'A': return 'grade-excellent';
      case 'B+': case 'B': return 'grade-good';
      case 'C': return 'grade-average';
      default: return 'grade-poor';
    }
  };

  const resetSelections = (level: 'region' | 'district') => {
    if (level === 'region') {
      setSelectedDistrict('');
      setSelectedSchool('');
    } else if (level === 'district') {
      setSelectedSchool('');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            TASSA Results System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access examination results organized by region, district, and school - NECTA style navigation
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Region Selection */}
          <Card className="results-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Select Region</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedRegion} 
                onValueChange={(value) => {
                  setSelectedRegion(value);
                  resetSelections('region');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose region..." />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* District Selection */}
          <Card className="results-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Select District</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedDistrict} 
                onValueChange={(value) => {
                  setSelectedDistrict(value);
                  resetSelections('district');
                }}
                disabled={!selectedRegion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose district..." />
                </SelectTrigger>
                <SelectContent>
                  {getDistricts(selectedRegion).map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* School Selection */}
          <Card className="results-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <School className="h-5 w-5 text-primary" />
                <span>Select School</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedSchool} 
                onValueChange={setSelectedSchool}
                disabled={!selectedDistrict}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose school..." />
                </SelectTrigger>
                <SelectContent>
                  {getSchools(selectedDistrict).map(school => (
                    <SelectItem key={school} value={school}>{school}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Results Display */}
        {selectedSchool && (
          <Card className="results-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">
                    Results for {selectedSchool}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Region:</strong> {selectedRegion}</p>
                    <p><strong>District:</strong> {selectedDistrict}</p>
                    <p><strong>Examination:</strong> TASSA Socratic Series 2024</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Index Number</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">Total Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{result.name}</TableCell>
                        <TableCell className="font-mono text-sm">{result.indexNo}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={getGradeClass(result.grade)}>
                            {result.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {result.total}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8 border-primary/20 bg-primary-light/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-primary mb-2">How to Use the Results System</h3>
              <p className="text-sm text-muted-foreground">
                Select your region first, then choose the district, and finally select the school to view detailed results.
                All results are organized in NECTA-style format for easy navigation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;