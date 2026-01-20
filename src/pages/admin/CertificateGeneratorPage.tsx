import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Award, IdCard, School, ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function CertificateGeneratorPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Teacher Certificate State
  const [teacherName, setTeacherName] = useState("");
  const [teacherSchool, setTeacherSchool] = useState("");
  const [teacherAward, setTeacherAward] = useState("");
  const [teacherSeries, setTeacherSeries] = useState("");

  // School Certificate State
  const [schoolName, setSchoolName] = useState("");
  const [schoolPosition, setSchoolPosition] = useState("");
  const [schoolRegion, setSchoolRegion] = useState("");
  const [schoolSeries, setSchoolSeries] = useState("");

  // ID Card State
  const [staffName, setStaffName] = useState("");
  const [staffPosition, setStaffPosition] = useState("");
  const [staffDepartment, setStaffDepartment] = useState("");
  const [staffIdNumber, setStaffIdNumber] = useState("");

  const generateTeacherCertificate = () => {
    if (!teacherName || !teacherSchool || !teacherAward || !teacherSeries) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Background gradient effect
    doc.setFillColor(245, 245, 250);
    doc.rect(0, 0, 297, 210, "F");

    // Border
    doc.setDrawColor(26, 82, 118);
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(1);
    doc.rect(15, 15, 267, 180);

    // Header decoration
    doc.setFillColor(26, 82, 118);
    doc.rect(20, 20, 257, 2, "F");

    // Logo placeholder circle
    doc.setFillColor(26, 82, 118);
    doc.circle(148.5, 40, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TASSA", 148.5, 42, { align: "center" });

    // Title
    doc.setTextColor(26, 82, 118);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICATE OF APPRECIATION", 148.5, 75, { align: "center" });

    // Subtitle
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Tanzania Secondary Schools Socratic Association", 148.5, 85, { align: "center" });

    // Main content
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text("This is to certify that", 148.5, 105, { align: "center" });

    // Teacher name
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 82, 118);
    doc.text(teacherName.toUpperCase(), 148.5, 120, { align: "center" });

    // School
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(`from ${teacherSchool}`, 148.5, 130, { align: "center" });

    // Award reason
    doc.setFontSize(12);
    doc.text("is hereby awarded this certificate in recognition of", 148.5, 145, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 82, 118);
    doc.text(teacherAward, 148.5, 157, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(`Series ${teacherSeries} Examinations`, 148.5, 167, { align: "center" });

    // Date and signature line
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    doc.setFontSize(10);
    doc.text(`Date: ${currentDate}`, 60, 185, { align: "center" });
    doc.line(40, 180, 80, 180);

    doc.text("TASSA Chairman", 148.5, 185, { align: "center" });
    doc.line(120, 180, 177, 180);

    doc.text("TASSA Secretary", 237, 185, { align: "center" });
    doc.line(210, 180, 264, 180);

    // Footer decoration
    doc.setFillColor(26, 82, 118);
    doc.rect(20, 195, 257, 2, "F");

    doc.save(`Teacher_Certificate_${teacherName.replace(/\s+/g, "_")}.pdf`);

    toast({
      title: "Certificate Generated",
      description: "Teacher appreciation certificate has been downloaded",
    });
  };

  const generateSchoolCertificate = () => {
    if (!schoolName || !schoolPosition || !schoolRegion || !schoolSeries) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Background
    doc.setFillColor(250, 248, 240);
    doc.rect(0, 0, 297, 210, "F");

    // Decorative border
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(4);
    doc.rect(8, 8, 281, 194);
    doc.setDrawColor(26, 82, 118);
    doc.setLineWidth(2);
    doc.rect(12, 12, 273, 186);

    // Corner decorations
    const corners = [
      [20, 20],
      [277, 20],
      [20, 190],
      [277, 190],
    ];
    doc.setFillColor(184, 134, 11);
    corners.forEach(([x, y]) => {
      doc.circle(x, y, 5, "F");
    });

    // Logo circle
    doc.setFillColor(26, 82, 118);
    doc.circle(148.5, 38, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TASSA", 148.5, 40, { align: "center" });

    // Title
    doc.setTextColor(184, 134, 11);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICATE OF EXCELLENCE", 148.5, 75, { align: "center" });

    // Subtitle
    doc.setTextColor(26, 82, 118);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Tanzania Secondary Schools Socratic Association", 148.5, 85, { align: "center" });

    // Content
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text("This certificate is proudly presented to", 148.5, 105, { align: "center" });

    // School name
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 82, 118);
    doc.text(schoolName.toUpperCase(), 148.5, 122, { align: "center" });

    // Region
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`${schoolRegion} Region`, 148.5, 132, { align: "center" });

    // Position and achievement
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text("in recognition of outstanding performance as", 148.5, 147, { align: "center" });

    const positionSuffix =
      schoolPosition === "1"
        ? "st"
        : schoolPosition === "2"
        ? "nd"
        : schoolPosition === "3"
        ? "rd"
        : "th";

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(184, 134, 11);
    doc.text(`${schoolPosition}${positionSuffix} BEST SCHOOL`, 148.5, 160, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(`in Series ${schoolSeries} National Examinations`, 148.5, 170, { align: "center" });

    // Date and signatures
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    doc.setFontSize(10);
    doc.text(`Date: ${currentDate}`, 60, 188, { align: "center" });
    doc.line(40, 183, 80, 183);

    doc.text("TASSA Chairman", 148.5, 188, { align: "center" });
    doc.line(120, 183, 177, 183);

    doc.text("TASSA Secretary", 237, 188, { align: "center" });
    doc.line(210, 183, 264, 183);

    doc.save(`School_Certificate_${schoolName.replace(/\s+/g, "_")}.pdf`);

    toast({
      title: "Certificate Generated",
      description: "Best school certificate has been downloaded",
    });
  };

  const generateIdCard = () => {
    if (!staffName || !staffPosition || !staffDepartment || !staffIdNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [86, 54], // Standard ID card size
    });

    // Front of ID Card
    // Background
    doc.setFillColor(26, 82, 118);
    doc.rect(0, 0, 86, 54, "F");

    // White content area
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(3, 3, 80, 48, 2, 2, "F");

    // Header stripe
    doc.setFillColor(26, 82, 118);
    doc.rect(3, 3, 80, 12, "F");

    // Organization name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("TANZANIA SECONDARY SCHOOLS", 43, 8, { align: "center" });
    doc.text("SOCRATIC ASSOCIATION", 43, 12, { align: "center" });

    // Photo placeholder
    doc.setFillColor(230, 230, 230);
    doc.rect(6, 18, 22, 26, "F");
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(6);
    doc.text("PHOTO", 17, 32, { align: "center" });

    // Staff details
    doc.setTextColor(26, 82, 118);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(staffName.toUpperCase(), 32, 23);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(staffPosition, 32, 28);

    doc.setFontSize(6);
    doc.text(`Department: ${staffDepartment}`, 32, 33);
    doc.text(`ID No: ${staffIdNumber}`, 32, 38);

    // Valid until
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    const validDate = validUntil.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
    doc.text(`Valid Until: ${validDate}`, 32, 43);

    // Footer
    doc.setFillColor(184, 134, 11);
    doc.rect(3, 47, 80, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.text("TASSA - Empowering Education Through Excellence", 43, 50, { align: "center" });

    // Add a new page for the back of the card
    doc.addPage([86, 54], "portrait");

    // Back of ID Card
    doc.setFillColor(26, 82, 118);
    doc.rect(0, 0, 86, 54, "F");

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(3, 3, 80, 48, 2, 2, "F");

    // Title
    doc.setTextColor(26, 82, 118);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("TASSA STAFF IDENTIFICATION", 43, 10, { align: "center" });

    // Instructions
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    const instructions = [
      "This card is the property of TASSA.",
      "If found, please return to:",
      "",
      "Tanzania Secondary Schools",
      "Socratic Association (TASSA)",
      "P.O. Box 12345, Dar es Salaam",
      "Tanzania",
      "",
      "For emergencies, call:",
      "+255 XXX XXX XXX",
    ];

    let yPos = 16;
    instructions.forEach((line) => {
      doc.text(line, 43, yPos, { align: "center" });
      yPos += 3;
    });

    // Signature line
    doc.line(20, 45, 66, 45);
    doc.setFontSize(5);
    doc.text("Authorized Signature", 43, 48, { align: "center" });

    doc.save(`TASSA_ID_${staffName.replace(/\s+/g, "_")}.pdf`);

    toast({
      title: "ID Card Generated",
      description: "Staff ID card (front and back) has been downloaded",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" onClick={() => navigate("/admin")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Certificate & ID Generator</h1>
          <p className="text-muted-foreground">
            Generate certificates of appreciation, school excellence awards, and TASSA staff ID cards
          </p>
        </div>

        <Tabs defaultValue="teacher" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teacher" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Teacher Certificate
            </TabsTrigger>
            <TabsTrigger value="school" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              School Certificate
            </TabsTrigger>
            <TabsTrigger value="id" className="flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              Staff ID Card
            </TabsTrigger>
          </TabsList>

          {/* Teacher Certificate Tab */}
          <TabsContent value="teacher">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Teacher Certificate of Appreciation
                </CardTitle>
                <CardDescription>
                  Generate certificates for teachers who have contributed to TASSA examinations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacherName">Teacher's Full Name</Label>
                    <Input
                      id="teacherName"
                      placeholder="Enter teacher's full name"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherSchool">School Name</Label>
                    <Input
                      id="teacherSchool"
                      placeholder="Enter school name"
                      value={teacherSchool}
                      onChange={(e) => setTeacherSchool(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherAward">Award/Recognition For</Label>
                    <Select value={teacherAward} onValueChange={setTeacherAward}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select award type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Outstanding Examination Setting">
                          Outstanding Examination Setting
                        </SelectItem>
                        <SelectItem value="Excellent Marking and Moderation">
                          Excellent Marking and Moderation
                        </SelectItem>
                        <SelectItem value="Best Subject Coordinator">Best Subject Coordinator</SelectItem>
                        <SelectItem value="Outstanding School Coordination">
                          Outstanding School Coordination
                        </SelectItem>
                        <SelectItem value="Excellence in Student Preparation">
                          Excellence in Student Preparation
                        </SelectItem>
                        <SelectItem value="Dedicated Service to TASSA">Dedicated Service to TASSA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherSeries">Series Number</Label>
                    <Select value={teacherSeries} onValueChange={setTeacherSeries}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select series" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            Series {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={generateTeacherCertificate} className="w-full md:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Certificate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* School Certificate Tab */}
          <TabsContent value="school">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-primary" />
                  Best School Certificate
                </CardTitle>
                <CardDescription>
                  Generate excellence certificates for top-performing schools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      placeholder="Enter school name"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolRegion">Region</Label>
                    <Input
                      id="schoolRegion"
                      placeholder="Enter region"
                      value={schoolRegion}
                      onChange={(e) => setSchoolRegion(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolPosition">Position Achieved</Label>
                    <Select value={schoolPosition} onValueChange={setSchoolPosition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                            {num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th"} Position
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolSeries">Series Number</Label>
                    <Select value={schoolSeries} onValueChange={setSchoolSeries}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select series" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            Series {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={generateSchoolCertificate} className="w-full md:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Certificate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff ID Card Tab */}
          <TabsContent value="id">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IdCard className="h-5 w-5 text-primary" />
                  TASSA Staff ID Card
                </CardTitle>
                <CardDescription>
                  Generate identification cards for TASSA department staff members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffName">Staff Full Name</Label>
                    <Input
                      id="staffName"
                      placeholder="Enter staff full name"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffPosition">Position</Label>
                    <Select value={staffPosition} onValueChange={setStaffPosition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chairman">Chairman</SelectItem>
                        <SelectItem value="Vice Chairman">Vice Chairman</SelectItem>
                        <SelectItem value="Secretary General">Secretary General</SelectItem>
                        <SelectItem value="Treasurer">Treasurer</SelectItem>
                        <SelectItem value="Academic Coordinator">Academic Coordinator</SelectItem>
                        <SelectItem value="Regional Coordinator">Regional Coordinator</SelectItem>
                        <SelectItem value="Subject Coordinator">Subject Coordinator</SelectItem>
                        <SelectItem value="IT Administrator">IT Administrator</SelectItem>
                        <SelectItem value="Office Assistant">Office Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffDepartment">Department</Label>
                    <Select value={staffDepartment} onValueChange={setStaffDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="IT & Communications">IT & Communications</SelectItem>
                        <SelectItem value="Regional Affairs">Regional Affairs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffIdNumber">ID Number</Label>
                    <Input
                      id="staffIdNumber"
                      placeholder="e.g., TASSA-2026-001"
                      value={staffIdNumber}
                      onChange={(e) => setStaffIdNumber(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={generateIdCard} className="w-full md:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Generate ID Card
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
