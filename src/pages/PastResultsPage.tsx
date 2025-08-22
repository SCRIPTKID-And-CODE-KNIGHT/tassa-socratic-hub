import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, Archive, FileText, Trophy, TrendingUp } from 'lucide-react';

const PastResultsPage = () => {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedSeries, setSelectedSeries] = useState('');

  // Sample past results data
  const pastResultsData = {
    '2023': [
      {
        id: 'series_2023_12',
        name: 'December 2023 Series',
        date: '2023-12-15',
        subjects: ['Geography', 'History', 'Economics'],
        participatingSchools: 89,
        totalStudents: 1250,
        status: 'completed',
        downloadUrl: '/downloads/december_2023_results.pdf'
      },
      {
        id: 'series_2023_09',
        name: 'September 2023 Series',
        date: '2023-09-20',
        subjects: ['Physical Geography', 'Human Geography', 'Environmental Studies'],
        participatingSchools: 95,
        totalStudents: 1380,
        status: 'completed',
        downloadUrl: '/downloads/september_2023_results.pdf'
      },
      {
        id: 'series_2023_06',
        name: 'June 2023 Series',
        date: '2023-06-25',
        subjects: ['Social Sciences', 'Political Science', 'Research Methods'],
        participatingSchools: 78,
        totalStudents: 1120,
        status: 'completed',
        downloadUrl: '/downloads/june_2023_results.pdf'
      }
    ],
    '2022': [
      {
        id: 'series_2022_12',
        name: 'December 2022 Series',
        date: '2022-12-18',
        subjects: ['Geography', 'History'],
        participatingSchools: 72,
        totalStudents: 980,
        status: 'completed',
        downloadUrl: '/downloads/december_2022_results.pdf'
      },
      {
        id: 'series_2022_09',
        name: 'September 2022 Series',
        date: '2022-09-22',
        subjects: ['Physical Geography', 'Economics'],
        participatingSchools: 68,
        totalStudents: 890,
        status: 'completed',
        downloadUrl: '/downloads/september_2022_results.pdf'
      }
    ],
    '2021': [
      {
        id: 'series_2021_12',
        name: 'December 2021 Series',
        date: '2021-12-20',
        subjects: ['Geography', 'Social Sciences'],
        participatingSchools: 65,
        totalStudents: 820,
        status: 'completed',
        downloadUrl: '/downloads/december_2021_results.pdf'
      }
    ]
  };

  const years = Object.keys(pastResultsData).sort((a, b) => b.localeCompare(a));
  const currentYearResults = pastResultsData[selectedYear] || [];

  // Statistics for the selected year
  const yearStats = currentYearResults.reduce(
    (acc, series) => ({
      totalSeries: acc.totalSeries + 1,
      totalSchools: Math.max(acc.totalSchools, series.participatingSchools),
      totalStudents: acc.totalStudents + series.totalStudents,
      subjects: [...new Set([...acc.subjects, ...series.subjects])]
    }),
    { totalSeries: 0, totalSchools: 0, totalStudents: 0, subjects: [] }
  );

  const handleDownload = (downloadUrl: string, fileName: string) => {
    // In a real app, this would download the actual file
    console.log(`Downloading: ${fileName} from ${downloadUrl}`);
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            Past Results Archive
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access and download historical results from previous TASSA Socratic Series competitions
          </p>
        </div>

        {/* Year Selection */}
        <div className="flex justify-center mb-8">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year..." />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Year Statistics */}
        {selectedYear && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center results-card">
              <CardContent className="pt-6">
                <Archive className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary mb-1">{yearStats.totalSeries}</div>
                <div className="text-sm text-muted-foreground">Series Conducted</div>
              </CardContent>
            </Card>
            <Card className="text-center results-card">
              <CardContent className="pt-6">
                <Trophy className="h-8 w-8 text-success mx-auto mb-3" />
                <div className="text-2xl font-bold text-success mb-1">{yearStats.totalSchools}</div>
                <div className="text-sm text-muted-foreground">Peak School Participation</div>
              </CardContent>
            </Card>
            <Card className="text-center results-card">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-warning mx-auto mb-3" />
                <div className="text-2xl font-bold text-warning mb-1">{yearStats.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Student Participants</div>
              </CardContent>
            </Card>
            <Card className="text-center results-card">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary mb-1">{yearStats.subjects.length}</div>
                <div className="text-sm text-muted-foreground">Subjects Covered</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results List */}
        <div className="space-y-6">
          {currentYearResults.length > 0 ? (
            currentYearResults.map((series) => (
              <Card key={series.id} className="results-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2 flex items-center space-x-2">
                        <Archive className="h-5 w-5 text-primary" />
                        <span>{series.name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(series.date).toLocaleDateString('en-GB')}</span>
                        </span>
                        <span>{series.participatingSchools} schools</span>
                        <span>{series.totalStudents.toLocaleString()} students</span>
                      </div>
                    </div>
                    <Badge className="bg-success text-success-foreground">
                      {series.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Subjects Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {series.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Participation Statistics</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>{series.participatingSchools}</strong> schools participated</p>
                        <p><strong>{series.totalStudents}</strong> students examined</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button
                        onClick={() => handleDownload(series.downloadUrl, `${series.name}_Results.pdf`)}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Results
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  {selectedYear ? `No results available for ${selectedYear}` : 'Please select a year to view results'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Download Information */}
        <Card className="mt-12 border-primary/20 bg-primary-light/10">
          <CardHeader>
            <CardTitle className="text-center">Download Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Available Formats</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• PDF - Complete results with school rankings</li>
                  <li>• Excel - Detailed student data and statistics</li>
                  <li>• Summary Reports - Key insights and trends</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Includes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Individual student results and grades</li>
                  <li>• School performance rankings</li>
                  <li>• Subject-wise analysis</li>
                  <li>• Regional comparisons</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PastResultsPage;