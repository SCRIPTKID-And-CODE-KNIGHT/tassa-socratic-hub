import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    email: '',
    phone: '',
    subject: '',
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

    try {
      // Insert contact message into Supabase
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          school: formData.school || null,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Message has been Sent Successfully!",
        description: "Your message has been received. We will get back soon to you within 24 hours.",
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center border-success/20 bg-success-light/20">
            <CardContent className="pt-12 pb-12">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
              <h1 className="text-2xl font-heading font-bold text-foreground mb-4">
                Message Sent Successfully!
              </h1>
              <p className="text-muted-foreground mb-6">
                Thank you for contacting TASSA. Your message has been received and will be 
                reviewed by our administrative team.
              </p>
              <div className="bg-card p-4 rounded-lg border mb-6">
                <h3 className="font-semibold mb-2 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  What Happens Next?
                </h3>
                <ul className="text-left text-sm space-y-1 text-muted-foreground">
                  <li>• We will review your message within 24 hours</li>
                  <li>• A response will be sent to: <strong>{formData.email}</strong></li>
                  <li>• Urgent matters may be contacted via phone</li>
                  <li>• You can check our announcements page for updates</li>
                </ul>
              </div>
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    school: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                  });
                }}
                variant="outline"
              >
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            Contact TASSA
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get in touch with Tanzania Socratic Series Association for inquiries, 
            support, or any questions about our educational programs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="form-section mb-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Email Address</h4>
                    <p className="text-sm text-muted-foreground">manumbadaudi@gmail.com</p>
                    <p className="text-sm text-muted-foreground">admin@tassa.ac.tz</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Phone Numbers</h4>
                    <p className="text-sm text-muted-foreground">+255 757 837 561 </p>
                    <p className="text-sm text-muted-foreground">+255 757 837 561</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Office Address</h4>
                    <p className="text-sm text-muted-foreground">
                      TASSA Headquarters<br />
                      Education District<br />
                      Geita Region, Tanzania
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                </div>
                <Alert className="mt-4">
                  <Clock className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    During examination periods, extended hours may apply. 
                    Check our announcements for updates.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="form-section">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-6 w-6 text-primary" />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="school">School Name</Label>
                      <Input
                        id="school"
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        placeholder="Your school name (if applicable)"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+255 XXX XXX XXX"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is your message about?"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      required
                      className="mt-1"
                    />
                  </div>

                  <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertDescription>
                      Your message will be sent to the TASSA administration team. We aim to respond 
                      to all inquiries within 24 hours during business days.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    type="submit" 
                    className="w-full btn-educational" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
