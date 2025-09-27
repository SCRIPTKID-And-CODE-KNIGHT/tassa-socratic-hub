import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, MapPin, School, Users, Phone, Mail, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface School {
  id: string;
  contact_name: string;
  school_name: string;
  phone_number: string;
  email: string | null;
  region: string;
  district: string;
  message: string | null;
  created_at: string;
  updated_at: string;
}

interface ParticipationConfirmation {
  id: string;
  school_id: string;
  series_number: number;
  confirmed_date: string;
  confirmed_by: string;
  number_of_students: number | null;
}

const RegisteredSchoolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterConfirmation, setFilterConfirmation] = useState('all');
  const [schools, setSchools] = useState<School[]>([]);
  const [confirmations, setConfirmations] = useState<ParticipationConfirmation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schoolsResponse, confirmationsResponse] = await Promise.all([
        supabase
          .from('schools')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('participation_confirmations')
          .select('*')
          .order('confirmed_date', { ascending: false })
      ]);

      if (schoolsResponse.error) throw schoolsResponse.error;
      if (confirmationsResponse.error) throw confirmationsResponse.error;

      setSchools(schoolsResponse.data || []);
      setConfirmations(confirmationsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSchoolConfirmation = (schoolId: string) => {
    return confirmations.find(conf => conf.school_id === schoolId);
  };

  const confirmedSchools = schools.filter(school => getSchoolConfirmation(school.id));
  
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || school.region === filterRegion;
    const hasConfirmation = getSchoolConfirmation(school.id) !== undefined;
    const matchesConfirmation = filterConfirmation === 'all' || 
                               (filterConfirmation === 'confirmed' && hasConfirmation) ||
                               (filterConfirmation === 'pending' && !hasConfirmation);
    return matchesSearch && matchesRegion && matchesConfirmation;
  });

  const regions = [...new Set(schools.map(school => school.region))];

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading registered schools...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            Registered Schools
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {schools.length === 0 
              ? "No schools have registered yet. Be the first to register your school!"
              : `${schools.length} schools registered with TASSA for participation in Socratic Series competitions`
            }
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center results-card">
            <CardContent className="pt-6">
              <School className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">{schools.length}</div>
              <div className="text-sm text-muted-foreground">Total Schools</div>
            </CardContent>
          </Card>
          <Card className="text-center results-card">
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 text-success mx-auto mb-3" />
              <div className="text-2xl font-bold text-success mb-1">{regions.length}</div>
              <div className="text-sm text-muted-foreground">Regions Represented</div>
            </CardContent>
          </Card>
          <Card className="text-center results-card">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-warning mx-auto mb-3" />
              <div className="text-2xl font-bold text-warning mb-1">{confirmedSchools.length}</div>
              <div className="text-sm text-muted-foreground">Confirmed for Participation</div>
            </CardContent>
          </Card>
        </div>

        {schools.length > 0 && (
          <>
            {/* Search and Filter */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search schools, contact person, district, or region..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filterRegion} onValueChange={setFilterRegion}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {regions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterConfirmation} onValueChange={setFilterConfirmation}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Schools</SelectItem>
                        <SelectItem value="confirmed">Confirmed Only</SelectItem>
                        <SelectItem value="pending">Pending Confirmation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schools List */}
            <div className="grid gap-6">
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <Card key={school.id} className="results-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2 flex items-center space-x-2">
                            <School className="h-5 w-5 text-primary" />
                            <span>{school.school_name}</span>
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{school.district}, {school.region}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {(() => {
                            const confirmation = getSchoolConfirmation(school.id);
                            if (confirmation) {
                              return (
                                <div className="space-y-2">
                                  <Badge className="bg-success text-success-foreground">
                                    ✓ CONFIRMED
                                  </Badge>
                                  <div className="text-xs text-muted-foreground">
                                    <p>Series {confirmation.series_number}</p>
                                    <p>{confirmation.number_of_students ? `${confirmation.number_of_students} students` : ''}</p>
                                    <p>By: {confirmation.confirmed_by}</p>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div className="space-y-2">
                                  <Badge variant="outline" className="border-warning text-warning">
                                    PENDING
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">
                                    Needs confirmation
                                  </p>
                                </div>
                              );
                            }
                          })()}
                          <p className="text-xs text-muted-foreground mt-2">
                            Registered: {new Date(school.created_at).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Contact Person</h4>
                          <p className="text-sm text-muted-foreground">{school.contact_name}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>Phone</span>
                          </h4>
                          <p className="text-sm text-muted-foreground font-mono">{school.phone_number}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>Email</span>
                          </h4>
                          <p className="text-sm text-muted-foreground break-all">
                            {school.email || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      {school.message && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold text-sm mb-2">Additional Information</h4>
                          <p className="text-sm text-muted-foreground">{school.message}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No schools found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {schools.length === 0 && (
          <div className="text-center py-12">
            <School className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Schools Registered Yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first school to register for TASSA Socratic Series competitions!
            </p>
            <Button asChild>
              <a href="/registration">Register Your School</a>
            </Button>
          </div>
        )}

        {/* Registration Info */}
        <Card className="mt-12 border-primary/20 bg-primary-light/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-primary mb-2">School Registration Information</h3>
              <p className="text-sm text-muted-foreground">
                Schools are automatically added to this list upon successful registration. 
                All registered schools are eligible to participate in TASSA Socratic Series competitions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisteredSchoolsPage;