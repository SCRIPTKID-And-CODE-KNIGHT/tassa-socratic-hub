import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Users, Clock, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface School {
  name: string;
  region: string;
  district: string;
  students: number;
}

const ParticipationPage = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    numberOfStudents: '',
    region: '',
    district: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedSchools, setConfirmedSchools] = useState<School[]>([]); // dynamic list
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newSchool: School = {
      name: formData.schoolName,
      region: formData.region,
      district: formData.district,
      students: Number(formData.numberOfStudents)
    };

    // Add the new school to confirmedSchools
    setConfirmedSchools(prev => [...prev, newSchool]);

    toast({
      title: "Participation Confirmed!",
      description: "Your school's participation has been confirmed for the upcoming series.",
    });

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center border-success/20 bg-success-light/20">
            <CardContent className="pt-12 pb-12">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
              <h1 className="text-2xl font-heading font-bold text-foreground mb-4">
                Participation Confirmed!
              </h1>
              <p className="text-muted-foreground mb-6">
                <strong>{formData.schoolName}</strong> has been successfully confirmed for participation 
                in the upcoming TASSA Socratic Series 2024.
              </p>
              <div className="bg-card p-4 rounded-lg border mb-6">
                <h3 className="font-semibold mb-2">Confirmation Details</h3>
                <div className="text-left text-sm space-y-1 text-muted-foreground">
                  <p><strong>School:</strong> {formData.schoolName}</p>
                  <p><strong>Contact:</strong> {formData.contactPerson}</p>
                  <p><strong>Students:</strong> {formData.numberOfStudents}</p>
                  <p><strong>Location:</strong> {formData.district}, {formData.region}</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    schoolName: '',
                    contactPerson: '',
                    phoneNumber: '',
                    email: '',
                    numberOfStudents: '',
                    region: '',
                    district: ''
                  });
                }}
                variant="outline"
              >
                Confirm Another School
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            Participation Confirmation
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confirm your school's participation in the upcoming TASSA Socratic Series 2024. 
            Registered schools must confirm participation for each series.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Confirmation Form */}
          <div className="lg:col-span-2">
            <Card className="form-section">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileCheck className="h-6 w-6 text-primary" />
                  <span>Confirm Participation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="schoolName">School Name *</Label>
                    <Input
                      id="schoolName"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      placeholder="Enter your school name"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="Teacher/coordinator name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+255 XXX XXX XXX"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="region">Region *</Label>
                      <Input
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        placeholder="School region"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="School district"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="numberOfStudents">Number of Students *</Label>
                      <Input
                        id="numberOfStudents"
                        name="numberOfStudents"
                        type="number"
                        min="1"
                        max="50"
                        value={formData.numberOfStudents}
                        onChange={handleInputChange}
                        placeholder="How many students?"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="school@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Alert>
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Upcoming Series: April 2024</strong><br />
                      Confirmation deadline: March 15th, 2024. Subject focus: Physical and Human Geography.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    type="submit" 
                    className="w-full btn-educational" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Confirming Participation...' : 'Confirm Participation'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Series Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="form-section">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span>Series Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary">April 2024 Series</h4>
                  <p className="text-sm text-muted-foreground">Physical & Human Geography Focus</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Confirmation Deadline:</span>
                    <Badge variant="outline">March 15, 2024</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Competition Dates:</span>
                    <Badge variant="outline">April 20-25, 2024</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Results Release:</span>
                    <Badge variant="outline">May 1, 2024</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="form-section">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-primary" />
                  <span>Important Dates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span>Registration Opens</span>
                    <Badge className="bg-success text-success-foreground">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-warning-light/20">
                    <span>Participation Confirmation</span>
                    <Badge className="bg-warning text-warning-foreground">Open Now</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span>Study Materials Release</span>
                    <Badge variant="outline">March 20, 2024</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span>Competition Week</span>
                    <Badge variant="outline">April 20-25, 2024</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmed Schools List */}
        <div className="mt-12">
          <Card className="form-section">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <span>Confirmed Schools for April 2024 Series</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {confirmedSchools.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {confirmedSchools.map((school, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{school.name}</h4>
                        <Badge variant="outline" className="text-xs">{school.students} students</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {school.district}, {school.region}
                      </p>
