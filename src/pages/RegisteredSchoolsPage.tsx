import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, School, Users, Phone, Mail } from 'lucide-react';

const RegisteredSchoolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample registered schools data
  const registeredSchools = [
    {
      id: '1',
      name: 'Azania Secondary School',
      region: 'Dar es Salaam',
      district: 'Kinondoni',
      contactPerson: 'Mwalimu John Ally',
      phone: '+255 712 345 678',
      email: 'azania.sec@example.com',
      registrationDate: '2024-01-15',
      status: 'active',
      studentsCount: 450
    },
    {
      id: '2',
      name: 'Mount Meru Secondary School',
      region: 'Arusha',
      district: 'Arusha City',
      contactPerson: 'Bi. Amina Hassan',
      phone: '+255 754 789 012',
      email: 'mountmeru.sec@example.com',
      registrationDate: '2024-01-12',
      status: 'active',
      studentsCount: 380
    },
    {
      id: '3',
      name: 'Lake Victoria Secondary School',
      region: 'Mwanza',
      district: 'Nyamagana',
      contactPerson: 'Mwalimu Peter Mwalimu',
      phone: '+255 768 234 567',
      email: 'lakevictoria.sec@example.com',
      registrationDate: '2024-01-10',
      status: 'active',
      studentsCount: 520
    },
    {
      id: '4',
      name: 'Benjamin Mkapa Secondary School',
      region: 'Dar es Salaam',
      district: 'Ilala',
      contactPerson: 'Dkt. Grace William',
      phone: '+255 782 901 234',
      email: 'bmkapa.sec@example.com',
      registrationDate: '2024-01-08',
      status: 'active',
      studentsCount: 610
    },
    {
      id: '5',
      name: 'Nelson Mandela Secondary School',
      region: 'Arusha',
      district: 'Arusha City',
      contactPerson: 'Mwalimu Daniel Emmanuel',
      phone: '+255 745 678 901',
      email: 'nmandela.sec@example.com',
      registrationDate: '2024-01-05',
      status: 'pending',
      studentsCount: 340
    },
    {
      id: '6',
      name: 'Kilimanjaro Secondary School',
      region: 'Kilimanjaro',
      district: 'Moshi Urban',
      contactPerson: 'Bi. Fatuma Seif',
      phone: '+255 789 123 456',
      email: 'kilimanjaro.sec@example.com',
      registrationDate: '2024-01-03',
      status: 'active',
      studentsCount: 420
    }
  ];

  const filteredSchools = registeredSchools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || school.region === filterRegion;
    const matchesStatus = filterStatus === 'all' || school.status === filterStatus;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const regions = [...new Set(registeredSchools.map(school => school.region))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const totalSchools = registeredSchools.length;
  const activeSchools = registeredSchools.filter(s => s.status === 'active').length;
  const pendingSchools = registeredSchools.filter(s => s.status === 'pending').length;
  const totalStudents = registeredSchools.reduce((sum, school) => sum + school.studentsCount, 0);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            Registered Schools
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete list of schools registered with TASSA for participation in Socratic Series competitions
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center results-card">
            <CardContent className="pt-6">
              <School className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">{totalSchools}</div>
              <div className="text-sm text-muted-foreground">Total Schools</div>
            </CardContent>
          </Card>
          <Card className="text-center results-card">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-success mx-auto mb-3" />
              <div className="text-2xl font-bold text-success mb-1">{activeSchools}</div>
              <div className="text-sm text-muted-foreground">Active Schools</div>
            </CardContent>
          </Card>
          <Card className="text-center results-card">
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 text-warning mx-auto mb-3" />
              <div className="text-2xl font-bold text-warning mb-1">{pendingSchools}</div>
              <div className="text-sm text-muted-foreground">Pending Approval</div>
            </CardContent>
          </Card>
          <Card className="text-center results-card">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">{totalStudents.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schools, contact person, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
                        <span>{school.name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{school.district}, {school.region}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{school.studentsCount} students</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(school.status)}>
                        {school.status.toUpperCase()}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Registered: {new Date(school.registrationDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Contact Person</h4>
                      <p className="text-sm text-muted-foreground">{school.contactPerson}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>Phone</span>
                      </h4>
                      <p className="text-sm text-muted-foreground font-mono">{school.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>Email</span>
                      </h4>
                      <p className="text-sm text-muted-foreground break-all">{school.email}</p>
                    </div>
                  </div>
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