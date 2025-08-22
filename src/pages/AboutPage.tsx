import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Trophy, Target, BookOpen, Award } from 'lucide-react';
import geographyBooks from '@/assets/geography-books.jpg';

const AboutPage = () => {
  const achievements = [
    { icon: Users, title: '450+ Schools', description: 'Registered across Tanzania' },
    { icon: Trophy, title: '12 Annual Series', description: 'Comprehensive competitions yearly' },
    { icon: BookOpen, title: '8 Subjects', description: 'Covered in competitions' },
    { icon: Award, title: '15+ Years', description: 'Of academic excellence' }
  ];

  const objectives = [
    {
      title: 'Academic Excellence',
      description: 'Foster the highest standards of academic achievement among Tanzanian secondary school students through rigorous and fair competitions.'
    },
    {
      title: 'Critical Thinking',
      description: 'Develop analytical and critical thinking skills that will serve students throughout their academic and professional careers.'
    },
    {
      title: 'Educational Equity',
      description: 'Provide equal opportunities for all secondary schools across Tanzania to participate in prestigious academic competitions.'
    },
    {
      title: 'National Development',
      description: 'Contribute to Tanzania\'s development by nurturing the next generation of educated leaders and professionals.'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            About TASSA
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tanzania Socratic Series Association - Empowering minds, building futures through academic excellence
          </p>
        </div>

        {/* Leadership Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <Card className="form-section">
              <CardHeader>
                <Badge className="w-fit mb-4 bg-primary text-primary-foreground">Leadership</Badge>
                <CardTitle className="text-2xl text-primary mb-4">
                  SIR DAUDI MUSULA MANUMBA
                </CardTitle>
                <p className="text-lg font-semibold text-muted-foreground">Founder & Supervisor</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Under the visionary leadership of Sir Daudi Musula Manumba, TASSA has become 
                  Tanzania's premier educational organization dedicated to promoting academic excellence. 
                  His commitment to educational advancement has transformed the landscape of secondary 
                  education competitions across the nation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Sir Daudi's educational philosophy centers on the belief that every student deserves 
                  the opportunity to excel academically, regardless of their geographical location or 
                  socioeconomic background. This vision has guided TASSA's mission to create inclusive, 
                  fair, and rigorous academic competitions.
                </p>
                <div className="bg-primary-light/20 p-4 rounded-lg border-l-4 border-l-primary">
                  <p className="text-sm font-medium text-primary">
                    "Education is the foundation of national development. Through TASSA, we nurture 
                    the intellectual capacity of Tanzania's youth, preparing them to lead our nation 
                    into a brighter future."
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">- Sir Daudi Musula Manumba</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="relative">
            <img 
              src={geographyBooks} 
              alt="Educational excellence at TASSA"
              className="rounded-lg shadow-educational-lg w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="form-section">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-primary" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To promote academic excellence and intellectual development among Tanzanian secondary 
                school students through comprehensive, fair, and challenging educational competitions 
                that foster critical thinking, creativity, and scholarly achievement across all regions 
                of Tanzania.
              </p>
            </CardContent>
          </Card>

          <Card className="form-section">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading educational organization in Tanzania, recognized for excellence in 
                academic competitions and for nurturing the next generation of scholars, leaders, 
                and innovators who will drive Tanzania's social and economic development.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Our Achievements
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              TASSA's impact on Tanzania's educational landscape through the years
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center results-card">
                <CardContent className="pt-6">
                  <achievement.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Objectives */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Our Objectives
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The core goals that drive TASSA's educational mission
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {objectives.map((objective, index) => (
              <Card key={index} className="results-card">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{objective.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{objective.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Competition Structure */}
        <Card className="form-section">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Competition Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-primary mb-2">Subject Areas</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Physical Geography</li>
                  <li>Human Geography</li>
                  <li>History</li>
                  <li>Social Sciences</li>
                  <li>Economics</li>
                  <li>Political Science</li>
                  <li>Environmental Studies</li>
                  <li>Research Methods</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Competition Levels</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Regional Preliminaries</li>
                  <li>District Championships</li>
                  <li>National Finals</li>
                  <li>Special Recognition Awards</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Annual Schedule</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Registration: January-March</li>
                  <li>Preliminaries: April-June</li>
                  <li>Championships: July-September</li>
                  <li>Finals: October-December</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;