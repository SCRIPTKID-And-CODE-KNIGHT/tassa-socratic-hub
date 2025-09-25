import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Trophy, FileText, ArrowRight } from 'lucide-react';
import AnnouncementCard from '@/components/AnnouncementCard';
import VoiceGreeting from '@/components/VoiceGreeting';
import geographyBooks from '@/assets/geography-books.jpg';

const HomePage = () => {
  // Fixed announcements data
  const sampleAnnouncements = [
    {
      id: '1',
      title: 'Registration Open for 2025 Socratic Series',
      content: 'We are pleased to announce that registration is now open for the 2025 Tanzania Socratic Series. All secondary schools are invited to participate in this prestigious academic competition.',
      date: '2025-09-19',
      priority: 'high' as const
    },
    {
      id: '2',
      title: 'KUKAMILIKA KWA SERIES NAMBA TATU',
      content: 'NATOA PONGEZI NYINGI SANA KWA WAALIMU WOTE AMBAO MUMEFANIKISHA KUFANYISHA MTIHANI SERIES NO 3 ASANTENI SANA TUENDELEE NA HATUA ZINAZOFUATA KAMA ALMANAC YETU INAVYOJIELEZA  MATOKEO YATATOKA TAREHE 9/10/2025  TUJITAHIDI NDUGU WAALIMU.',
      date: '2025-09-22',
      priority: 'high' as const
    },
    {
      id: '3',
      title: 'Geography Focus for Upcoming Series',
      content: 'The upcoming September series will focus primarily on Physical and Human Geography. Schools should prepare their students accordingly.',
      date: '2025-09-22',
      priority: 'medium' as const
    }
  ];

  const quickStats = [
    { icon: Users, label: 'Registered Schools', value: '25+' },
    { icon: Trophy, label: 'Annual Series', value: '12' },
    { icon: BookOpen, label: 'Subjects Covered', value: '1' },
    { icon: FileText, label: 'Past Papers', value: '200+' }
  ];

  return (
    <div className="min-h-screen">
      <VoiceGreeting />

      {/* Hero Section */}
      <section
        className="hero-section py-20 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.8), rgba(37, 99, 235, 0.9)), url(${geographyBooks})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground mb-6">
            Tanzania Socratic Series Association
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Empowering academic excellence through comprehensive educational competitions across Tanzania
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/registration">
              <Button size="lg" className="btn-educational">
                Register Your School
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/results">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-primary">
                View Results
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="stats-section py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="text-center p-6">
              <stat.icon className="mx-auto mb-2 h-10 w-10 text-primary-foreground" />
              <CardTitle>{stat.value}</CardTitle>
              <CardContent>{stat.label}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section className="announcements-section py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {sampleAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
