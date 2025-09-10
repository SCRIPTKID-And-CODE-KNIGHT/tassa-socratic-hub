import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Trophy, FileText, ArrowRight } from 'lucide-react';
import AnnouncementCard from '@/components/AnnouncementCard';
import VoiceGreeting from '@/components/VoiceGreeting';
import geographyBooks from '@/assets/geography-books.jpg';

const HomePage = () => {
  // Sample announcements data
  const sampleAnnouncements = [
    {
      id: '1',
      title: 'Registration Open for 2024 Socratic Series',
      content: 'We are pleased to announce that registration is now open for the 2025 Tanzania Socratic Series. All secondary schools are invited to participate in this prestigious academic competition.',
      date: '2025-09-19',
      priority: 'high' as const
    },
    {
      id: '2',
      title: 'Geography Focus for March Series',
      content: 'The upcoming September series will focus primarily on Physical and Human Geography. Schools should prepare their students accordingly.',
      date: '2025-09-19',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
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
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-educational">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About TASSA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">
                About TASSA
              </h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">
                  Under the Supervision of SIR DAUDI MUSULA MANUMBA
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Tanzania Socratic Series Association (TASSA) is a prestigious educational organization 
                  dedicated to promoting academic excellence across Tanzania's secondary schools. Founded under 
                  the visionary leadership of Sir Daudi Musula Manumba, TASSA conducts comprehensive academic 
                  competitions that challenge students and elevate educational standards nationwide.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to foster critical thinking, academic rigor, and intellectual development 
                  through structured competitions that cover various subjects with particular emphasis on 
                  Geography and Social Sciences. We believe in nurturing the next generation of Tanzanian 
                  leaders through academic excellence.
                </p>
                <Link to="/about">
                  <Button variant="outline" className="mt-4">
                    Learn More About TASSA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={geographyBooks} 
                alt="Geography books and educational materials"
                className="rounded-lg shadow-educational-lg w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Latest Announcements
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest news and announcements from TASSA
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {sampleAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/announcements">
              <Button variant="outline">
                View All Announcements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Quick Actions
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="results-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span>View Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access current and past examination results organized by region, district, and school.
                </p>
                <Link to="/results">
                  <Button className="w-full">Access Results</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="results-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-primary" />
                  <span>School Registration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Register your school to participate in upcoming Socratic Series competitions.
                </p>
                <Link to="/registration">
                  <Button className="w-full">Register School</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="results-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <span>Contact Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get in touch with TASSA administration for inquiries and support.
                </p>
                <Link to="/contact">
                  <Button className="w-full">Contact TASSA</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
