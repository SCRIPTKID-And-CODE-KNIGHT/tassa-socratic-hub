import { Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AchievementsSection = () => {
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
        </div>

        {/* Best Schools */}
        <div>
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-blue-900">Top Performing Schools</h3>
          </div>

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
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
