import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, School, Phone, Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    schoolName: '',
    phoneNumber: '',
    email: '',
    region: '',
    district: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Here you would typically send the data to your backend
    console.log('Registration submitted:', formData);

    toast({
      title: "Registration Successful!",
      description: "Your school has been registered successfully. You will receive a confirmation email shortly.",
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
                Registration Successful!
              </h1>
              <p className="text-muted-foreground mb-6">
                Thank you for registering <strong>{formData.schoolName}</strong> with TASSA. 
                Your school has been added to our registered schools list.
              </p>
              <div className="bg-card p-4 rounded-lg border mb-6">
                <h3 className="font-semibold mb-2">What's Next?</h3>
                <ul className="text-left text-sm space-y-1 text-muted-foreground">
                  <li>• You will receive a confirmation email within 24 hours</li>
                  <li>• Check the announcements page for upcoming series dates</li>
                  <li>• Use the participation page to confirm attendance for specific series</li>
                  <li>• Contact us if you have any questions</li>
                </ul>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      fullName: '',
                      schoolName: '',
                      phoneNumber: '',
                      email: '',
                      region: '',
                      district: '',
                      message: ''
                    });
                  }}
                  variant="outline"
                >
                  Register Another School
                </Button>
                <Button asChild>
                  <Link to="/registered-schools">
                    View All Registered Schools
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            School Registration
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Register your school to participate in TASSA Socratic Series competitions. 
            All registered schools will be automatically added to our official list.
          </p>
        </div>

        <Card className="form-section">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-6 w-6 text-primary" />
              <span>Registration Form</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Contact Person Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name of contact person"
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

              <div>
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  placeholder="Enter complete school name"
                  required
                  className="mt-1"
                />
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

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="school@example.com (optional)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Any additional information about your school or special requirements..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <Alert>
                <School className="h-4 w-4" />
                <AlertDescription>
                  Once submitted, your school will be automatically added to the "Registered Schools" list. 
                  You can then use the participation page to confirm attendance for specific series.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full btn-educational" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering School...' : 'Register School'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="mt-8 border-primary/20 bg-primary-light/10">
          <CardHeader>
            <CardTitle className="text-center">Registration Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Academic Excellence
                </h4>
                <p className="text-muted-foreground pl-6">
                  Participate in prestigious academic competitions that challenge and inspire students
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Official Recognition
                </h4>
                <p className="text-muted-foreground pl-6">
                  Get listed in the official TASSA registered schools directory
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Regular Updates
                </h4>
                <p className="text-muted-foreground pl-6">
                  Receive notifications about upcoming series and important announcements
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Results Access
                </h4>
                <p className="text-muted-foreground pl-6">
                  Access detailed results and performance analytics for your students
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationPage;