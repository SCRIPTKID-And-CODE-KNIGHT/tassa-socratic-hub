import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  School,
  Archive,
  ExternalLink,
  Trophy,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeneralResults {
  general_results_url: string | null;
  top_ten_students_url: string | null;
  top_ten_schools_url: string | null;
}

interface SchoolResult {
  individual_results_url: string | null;
  schools: {
    school_name: string;
  };
}

const SchoolsResultsPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [generalResults, setGeneralResults] = useState<GeneralResults | null>(null);
  const [schoolResult, setSchoolResult] = useState<SchoolResult | null>(null);
  const [currentSeries, setCurrentSeries] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    fetchSchools();
    fetchGeneralResults();
  }, [currentSeries]);

  useEffect(() => {
    if (selectedSchool) {
      fetchSchoolResult(selectedSchool);
    }
  }, [selectedSchool, currentSeries]);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('school_name');

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        title: "Error",
        description: "Failed to load schools",
        variant: "destructive"
      });
    }
  };

  const fetchGeneralResults = async () => {
    try {
      const { data, error } = await supabase
        .from('general_results')
        .select('general_results_url, top_ten_students_url, top_ten_schools_url')
        .eq('series_number', currentSeries)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      setGeneralResults(data);
    } catch (error) {
      console.error('Error fetching general results:', error);
    }
  };

  const fetchSchoolResult = async (schoolId: string) => {
    try {
      const { data, error } = await supabase
        .from('school_results')
        .select(`
          individual_results_url,
          schools!inner(school_name)
        `)
        .eq('school_id', schoolId)
        .eq('series_number', currentSeries)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      setSchoolResult(data);
    } catch (error) {
      console.error('Error fetching school result:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 flex flex-col items-center">
      <h1 className="text-2xl sm:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm px-4">
        TASSA Results System - Series {currentSeries}
      </h1>

      {/* Series Selector */}
      <div className="w-full max-w-md px-4 sm:px-0 mb-4 animate-fade-in">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold">
              Select Series
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={currentSeries.toString()} onValueChange={(value) => setCurrentSeries(parseInt(value))}>
              <SelectTrigger className="w-full h-12 rounded-xl shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Series 1 - March</SelectItem>
                <SelectItem value="2">Series 2 - June</SelectItem>
                <SelectItem value="3">Series 3 - September</SelectItem>
                <SelectItem value="4">Series 4 - December</SelectItem>
                <SelectItem value="5">Series 5</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* School Selector */}
      <div className="w-full max-w-md px-4 sm:px-0 animate-fade-in">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg font-semibold">
              <School className="h-5 w-5 text-blue-600" />
              <span>Select School</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="w-full h-12 rounded-xl shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder="Choose school..." />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id} className="py-3">
                    {school.school_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Announcement */}
      {!selectedSchool && (
        <div className="w-full max-w-2xl mt-8 px-4 sm:px-0 animate-fade-in">
          <Card className="text-center py-10 px-6 rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent>
              <School className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4 text-gray-800">Results Announcement</h3>
              <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
                {generalResults ? (
                  <>
                    Results for Series {currentSeries} have been released.
                    <br />
                    Select a school above to view their specific results.
                  </>
                ) : (
                  <>
                    Results for Series {currentSeries} will be available soon.
                    <br />
                    Please check back later.
                  </>
                )}
              </p>
              <p className="text-gray-500 font-medium">— TASSA IT Department</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Cards */}
      {selectedSchool && (
        <div className="w-full max-w-md mt-8 px-4 sm:px-0 space-y-6 animate-fade-in">
          {/* General Results */}
          {generalResults?.general_results_url && (
            <Card className="text-center py-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent>
                <Archive className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-6">General Results</h3>
                <a
                  href={generalResults.general_results_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition"
                >
                  View General Results
                  <ExternalLink className="h-5 w-5 ml-2" />
                </a>
              </CardContent>
            </Card>
          )}

          {/* Top Ten Students */}
          {generalResults?.top_ten_students_url && (
            <Card className="text-center py-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent>
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-6">Top Ten Students</h3>
                <a
                  href={generalResults.top_ten_students_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition"
                >
                  View Top Ten
                  <ExternalLink className="h-5 w-5 ml-2" />
                </a>
              </CardContent>
            </Card>
          )}

          {/* Top Ten Schools */}
          {generalResults?.top_ten_schools_url && (
            <Card className="text-center py-8 rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent>
                <Trophy className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-6">Top Ten Schools</h3>
                <a
                  href={generalResults.top_ten_schools_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition"
                >
                  View Top Schools
                  <ExternalLink className="h-5 w-5 ml-2" />
                </a>
              </CardContent>
            </Card>
          )}

          {/* Individual Results */}
          {schoolResult?.individual_results_url ? (
            <Card className="text-center py-8 rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent>
                <h3 className="text-lg sm:text-xl font-bold mb-6">
                  {schoolResult.schools.school_name} – Individual Results
                </h3>
                <a
                  href={schoolResult.individual_results_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition"
                >
                  Open School Results
                  <ExternalLink className="h-5 w-5 ml-2" />
                </a>
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-gray-500 mt-6">
              Individual results for the selected school will be uploaded soon.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolsResultsPage;