import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Trophy, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import VoiceGreeting from '@/components/VoiceGreeting';
import AchievementsSection from '@/components/AchievementsSection';
import ExamCountdown from '@/components/ExamCountdown';
import geographyBooks from '@/assets/geography-books.jpg';
import founderImage from '@/assets/founder-daudi-manumba.jpg';

const HomePage = () => {
  const quickStats = [
    { icon: Users, label: 'Registered Schools', value: '25+' },
    { icon: Trophy, label: 'Annual Series', value: '12' },
    { icon: BookOpen, label: 'Subjects Covered', value: '1' },
    { icon: FileText, label: 'Past Papers', value: '200+' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-emerald-50">
      <VoiceGreeting />

      {/* Top Study Materials Button - Refreshed 2026 Style */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 text-white py-4 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm font-medium bg-emerald-500 px-3 py-1 rounded-full animate-pulse">NEW 2026</span>
          <Button
            onClick={() => window.open('https://tassageoacademy.vercel.app', '_blank', 'noopener,noreferrer')}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 text-blue-900 font-bold hover:from-yellow-500 hover:to-amber-600 hover:scale-105 transition-all duration-300 shadow-lg no-underline"
            size="lg"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            STUDY MATERIALS AND RESOURCES
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Moving Marquee - New Year 2026 */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-4 overflow-hidden shadow-lg relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
        <div className="animate-marquee whitespace-nowrap relative">
          <span className="text-2xl font-bold mx-8">🎉 WELCOME TO 2026! WISHING ALL TASSA SCHOOLS A YEAR OF EXCELLENCE AND ACHIEVEMENT 🌟</span>
          <span className="text-2xl font-bold mx-8">📚 NEW YEAR, NEW GOALS - LET&apos;S MAKE 2026 THE BEST YEAR YET! 🏆</span>
          <span className="text-2xl font-bold mx-8">🎉 WELCOME TO 2026! WISHING ALL TASSA SCHOOLS A YEAR OF EXCELLENCE AND ACHIEVEMENT 🌟</span>
          <span className="text-2xl font-bold mx-8">📚 NEW YEAR, NEW GOALS - LET&apos;S MAKE 2026 THE BEST YEAR YET! 🏆</span>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="hero-section py-24 relative overflow-hidden text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 40, 120, 0.85), rgba(0, 40, 120, 0.85)), url(${geographyBooks})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-heading animate-fade-in">
            Tanzania Advanced Socratic Schools Association
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Empowering academic excellence through comprehensive educational
            competitions across Tanzania
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Link to="/registration">
              <Button
                size="lg"
                className="bg-yellow-400 text-blue-900 font-semibold hover:bg-yellow-500 hover:scale-105 transition-transform"
              >
                Register Your School
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/results">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-800 transition"
              >
                View Results
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Exam Countdown Section */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <ExamCountdown />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="stats-section py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="rounded-2xl border-blue-200 shadow-md hover:shadow-xl transition-shadow duration-300 p-6 text-center bg-gradient-to-b from-blue-50 to-white">
                <stat.icon className="mx-auto mb-3 h-10 w-10 text-blue-600" />
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-blue-800">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-700 font-medium">
                  {stat.label}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <AchievementsSection />

      {/* Co-Founder Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-8">Our Leadership</h2>
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <img 
                src={founderImage} 
                alt="Sir Daudi Musula Manumba - Co-Founder of TASSA"
                className="rounded-xl shadow-xl w-48 h-56 object-cover object-top border-4 border-blue-200"
              />
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
                <p className="text-xs font-semibold">Co-Founder</p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-blue-800 mt-4">Sir Daudi Musula Manumba</h3>
            <p className="text-blue-600 mt-2">Co-Founder & Supervisor</p>
            <Link to="/about" className="mt-4">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-blue-100 py-8 text-center">
        <p className="text-sm">
          © 2026 Tanzania Advanced Socratic Schools Association. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
