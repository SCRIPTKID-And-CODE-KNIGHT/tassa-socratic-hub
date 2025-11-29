import { useState, useEffect } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface TopStudent {
  id: string;
  student_name: string;
  school_name: string;
  region: string;
  district: string;
  subject: string;
  marks: number;
  position: number;
  series_number: number;
}

interface BestSchool {
  id: string;
  school_name: string;
  region: string;
  district: string;
  average_marks: number;
  position: number;
  series_number: number;
  total_students: number | null;
}

const AchievementsSection = () => {
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [bestSchools, setBestSchools] = useState<BestSchool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedData();
  }, []);

  const fetchPublishedData = async () => {
    try {
      const [studentsResponse, schoolsResponse] = await Promise.all([
        supabase
          .from('top_students')
          .select('*')
          .eq('is_published', true)
          .order('series_number', { ascending: false })
          .order('position', { ascending: true }),
        supabase
          .from('best_schools')
          .select('*')
          .eq('is_published', true)
          .order('series_number', { ascending: false })
          .order('position', { ascending: true })
      ]);

      if (studentsResponse.data) setTopStudents(studentsResponse.data);
      if (schoolsResponse.data) setBestSchools(schoolsResponse.data);
    } catch (error) {
      console.error('Error fetching published data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-blue-600">Loading achievements...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-blue-900 mb-4 font-heading">
            Hall of Excellence
          </h2>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            Celebrating outstanding academic achievements and exceptional performance
          </p>
        </div>

        {/* Top Students */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h3 className="text-2xl font-bold text-blue-900">Top Performing Students</h3>
          </div>

          {topStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topStudents.map((student) => (
                <Card key={student.id} className="bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-200 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <Trophy className="h-10 w-10 text-yellow-500" />
                      <span className="text-2xl font-bold text-yellow-600">#{student.position}</span>
                    </div>
                    <h4 className="text-xl font-bold text-blue-900 mb-2">{student.student_name}</h4>
                    <p className="text-blue-700 font-semibold mb-1">{student.school_name}</p>
                    <p className="text-blue-600 text-sm mb-3">{student.district}, {student.region}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                      <span className="text-sm text-blue-600">{student.subject}</span>
                      <span className="text-lg font-bold text-blue-900">{student.marks}%</span>
                    </div>
                    <p className="text-xs text-blue-500 mt-2">Series {student.series_number}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-200">
              <CardContent>
                <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-blue-900 text-lg font-semibold mb-2">
                  Top Performing Students
                </p>
                <p className="text-blue-600">
                  Will be nominated soon
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Best Schools */}
        <div>
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-blue-900">Top Performing Schools</h3>
          </div>

          {bestSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestSchools.map((school) => (
                <Card key={school.id} className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="h-10 w-10 text-blue-500" />
                      <span className="text-2xl font-bold text-blue-600">#{school.position}</span>
                    </div>
                    <h4 className="text-xl font-bold text-blue-900 mb-2">{school.school_name}</h4>
                    <p className="text-blue-600 text-sm mb-3">{school.district}, {school.region}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                      <span className="text-sm text-blue-600">Average Score</span>
                      <span className="text-lg font-bold text-blue-900">{Number(school.average_marks).toFixed(1)}%</span>
                    </div>
                    {school.total_students && (
                      <p className="text-sm text-blue-600 mt-2">{school.total_students} students</p>
                    )}
                    <p className="text-xs text-blue-500 mt-2">Series {school.series_number}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
              <CardContent>
                <TrendingUp className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-900 text-lg font-semibold mb-2">
                  Top Performing Schools
                </p>
                <p className="text-blue-600">
                  Will be uploaded soon
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
