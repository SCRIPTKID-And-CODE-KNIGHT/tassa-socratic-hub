import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Trophy, FileText, ArrowRight } from 'lucide-react';
import AnnouncementCard from '@/components/AnnouncementCard';
import VoiceGreeting from '@/components/VoiceGreeting';
import geographyBooks from '@/assets/geography-books.jpg';
import { motion } from 'framer-motion';

const HomePage = () => {
  const sampleAnnouncements = [
    {
      id: '1',
      title: 'KUKAMILIKA KWA SERIES NAMBA TATU',
      content:
        'NATOA PONGEZI NYINGI SANA KWA WAALIMU WOTE AMBAO MMEFANIKISHA KUFANYISHA MTIHANI SERIES NO 3 ASANTENI SANA TUENDELEE NA HATUA ZINAZOFUATA KAMA ALMANAC YETU INAVYOJIELEZA  MATOKEO YATATOKA TAREHE 9/10/2025  TUJITAHIDI NDUGU WAALIMU.',
      date: '2025-09-22',
      priority: 'high' as const,
    },
  ];

  const quickStats = [
    { icon: Users, label: 'Registered Schools', value: '25+' },
    { icon: Trophy, label: 'Annual Series', value: '12' },
    { icon: BookOpen, label: 'Subjects Covered', value: '1' },
    { icon: FileText, label: 'Past Papers', value: '200+' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100">
      <VoiceGreeting />

      {/* Top Hyperlink */}
      <div className="bg-blue-700 text-white py-3 text-center shadow-md">
        <a
          href="https://tassa-geo-ematerials-irs3.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold tracking-wide underline hover:text-yellow-300 transition"
        >
          STUDY MATERIALS AND RESOURCES
        </a>
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
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6 font-heading"
          >
            Tanzania Socratic Series Association
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
          >
            Empowering academic excellence through comprehensive educational
            competitions across Tanzania
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
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
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="stats-section py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Announcement */}
      <section className="announcements-section py-20 bg-blue-50 border-t border-blue-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
            Latest Announcement
          </h2>
          <AnnouncementCard announcement={sampleAnnouncements[0]} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-100 py-6 text-center">
        <p className="text-sm">
          © 2025 Tanzania Socratic Series Association. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
