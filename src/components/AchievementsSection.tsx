import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Award, TrendingUp, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface TopStudent {
  id: string;
  student_name: string;
  school_name: string;
  marks: number;
  position: number;
  region: string;
  district: string;
  series_number: number;
}

interface BestSchool {
  id: string;
  school_name: string;
  average_marks: number;
  position: number;
  region: string;
  district: string;
  series_number: number;
  total_students: number | null;
}

const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}</span>;
};

const AchievementsSection = () => {
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [bestSchools, setBestSchools] = useState<BestSchool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const [studentsResponse, schoolsResponse] = await Promise.all([
          supabase
            .from('top_students')
            .select('*')
            .eq('is_published', true)
            .order('position', { ascending: true })
            .limit(3),
          supabase
            .from('best_schools')
            .select('*')
            .eq('is_published', true)
            .order('position', { ascending: true })
            .limit(3),
        ]);

        if (studentsResponse.data) setTopStudents(studentsResponse.data);
        if (schoolsResponse.data) setBestSchools(schoolsResponse.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
            Loading Achievements...
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-4 font-heading">
            Hall of Excellence
          </h2>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            Celebrating outstanding academic achievements and exceptional performance
          </p>
        </motion.div>

        {/* Top Students */}
        {topStudents.length > 0 && (
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h3 className="text-2xl font-bold text-blue-900">Top Performing Students</h3>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-bl-[100%] flex items-start justify-end p-3">
                      <span className="text-2xl font-bold text-white">#{student.position}</span>
                    </div>
                    <CardHeader>
                      <Star className="h-8 w-8 text-yellow-500 mb-2" />
                      <CardTitle className="text-xl text-blue-900 pr-16">
                        {student.student_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm font-semibold text-blue-700">{student.school_name}</p>
                      <p className="text-xs text-blue-600">
                        {student.district}, {student.region}
                      </p>
                      <div className="flex items-center gap-2 pt-3">
                        <Award className="h-5 w-5 text-blue-600" />
                        <span className="text-3xl font-bold text-blue-900">
                          <AnimatedCounter end={student.marks} />
                        </span>
                        <span className="text-sm text-blue-600">marks</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Series {student.series_number}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Best Schools */}
        {bestSchools.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-blue-900">Top Performing Schools</h3>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bestSchools.map((school, index) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-yellow-50">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-bl-[100%] flex items-start justify-end p-3">
                      <span className="text-2xl font-bold text-white">#{school.position}</span>
                    </div>
                    <CardHeader>
                      <Trophy className="h-8 w-8 text-blue-600 mb-2" />
                      <CardTitle className="text-xl text-blue-900 pr-16">
                        {school.school_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-xs text-blue-600">
                        {school.district}, {school.region}
                      </p>
                      <div className="flex items-center gap-2 pt-3">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span className="text-3xl font-bold text-blue-900">
                          <AnimatedCounter end={Math.round(school.average_marks)} duration={2.5} />
                        </span>
                        <span className="text-sm text-blue-600">avg</span>
                      </div>
                      {school.total_students && (
                        <p className="text-xs text-muted-foreground">
                          {school.total_students} students participated
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Series {school.series_number}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {topStudents.length === 0 && bestSchools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <Trophy className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            <p className="text-blue-600 text-lg">
              Achievements will be displayed once results are published
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AchievementsSection;
