import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Award, IdCard, School, ArrowLeft, Download, Users, Upload, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import certificateTemplateBg from "@/assets/certificate-template-bg.png";

export default function CertificateGeneratorPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Logo state
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Custom background state
  const [bgDataUrl, setBgDataUrl] = useState<string | null>(null);
  const [bgFileName, setBgFileName] = useState<string>("");
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Hidden printable refs (used for html2canvas → PDF capture)
  const appreciationPrintRef = useRef<HTMLDivElement>(null);
  const schoolPrintRef = useRef<HTMLDivElement>(null);

  // Appreciation Certificate State
  const [recipientType, setRecipientType] = useState<"teacher" | "student">("teacher");
  const [recipientName, setRecipientName] = useState("");
  const [certTitle, setCertTitle] = useState("CERTIFICATE");
  const [certSubtitle, setCertSubtitle] = useState("OF PARTICIPATION");
  const [certIntro, setCertIntro] = useState("This certificate is proudly presented to");
  const [certBody, setCertBody] = useState(
    "in recognition of outstanding performance, dedication, and commitment to learning.\nYour hard work and achievements are highly commendable, and we sincerely appreciate your efforts."
  );
  const [certSignName, setCertSignName] = useState("DAUDI MUSULA MANUMBA");
  const [certSignTitle, setCertSignTitle] = useState("TASSA COORDINATOR");
  const [certEvent, setCertEvent] = useState("");
  const [certDate, setCertDate] = useState(new Date().toISOString().slice(0, 10));
  const [certLocation, setCertLocation] = useState("");

  // School Certificate State
  const [schoolName, setSchoolName] = useState("");
  const [schoolPosition, setSchoolPosition] = useState("");
  const [schoolRegion, setSchoolRegion] = useState("");
  const [schoolSeries, setSchoolSeries] = useState("");
  const [schoolCertTitle, setSchoolCertTitle] = useState("CERTIFICATE");
  const [schoolCertSubtitle, setSchoolCertSubtitle] = useState("OF EXCELLENCE");
  const [schoolCertIntro, setSchoolCertIntro] = useState("This certificate is proudly presented to");
  const [schoolCertBody, setSchoolCertBody] = useState(
    "for outstanding performance and dedication to academic excellence."
  );

  // ID Card State
  const [staffName, setStaffName] = useState("");
  const [staffPosition, setStaffPosition] = useState("");
  const [staffDepartment, setStaffDepartment] = useState("");
  const [staffIdNumber, setStaffIdNumber] = useState("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoDataUrl(ev.target?.result as string);
      setLogoFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBgDataUrl(ev.target?.result as string);
      setBgFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const captureToPdf = async (el: HTMLElement, filename: string) => {
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    // A4 landscape: 297 x 210 mm
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
    pdf.save(filename);
  };

  const generateAppreciationCertificate = async () => {
    if (!recipientName) {
      toast({ title: "Missing Information", description: "Please enter recipient name", variant: "destructive" });
      return;
    }
    if (!appreciationPrintRef.current) return;
    try {
      await captureToPdf(
        appreciationPrintRef.current,
        `Certificate_${recipientName.replace(/\s+/g, "_")}.pdf`
      );
      toast({ title: "Certificate Generated", description: "Certificate has been downloaded" });
    } catch (err) {
      console.error(err);
      toast({ title: "Generation failed", description: "Could not render certificate", variant: "destructive" });
    }
  };

  const generateSchoolCertificate = async () => {
    if (!schoolName || !schoolPosition || !schoolRegion || !schoolSeries) {
      toast({ title: "Missing Information", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (!schoolPrintRef.current) return;
    try {
      await captureToPdf(
        schoolPrintRef.current,
        `School_Certificate_${schoolName.replace(/\s+/g, "_")}.pdf`
      );
      toast({ title: "Certificate Generated", description: "School certificate has been downloaded" });
    } catch (err) {
      console.error(err);
      toast({ title: "Generation failed", description: "Could not render certificate", variant: "destructive" });
    }
  };

  const generateIdCard = () => {
    if (!staffName || !staffPosition || !staffDepartment || !staffIdNumber) {
      toast({ title: "Missing Information", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [86, 54] });

    doc.setFillColor(26, 82, 118);
    doc.rect(0, 0, 86, 54, "F");
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(3, 3, 80, 48, 2, 2, "F");
    doc.setFillColor(26, 82, 118);
    doc.rect(3, 3, 80, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("TANZANIA SECONDARY SCHOOLS", 43, 8, { align: "center" });
    doc.text("SOCRATIC ASSOCIATION", 43, 12, { align: "center" });

    doc.setFillColor(230, 230, 230);
    doc.rect(6, 18, 22, 26, "F");
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(6);
    doc.text("PHOTO", 17, 32, { align: "center" });

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

    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    doc.text(`Valid Until: ${validUntil.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`, 32, 43);

    doc.setFillColor(184, 134, 11);
    doc.rect(3, 47, 80, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.text("TASSA - Empowering Education Through Excellence", 43, 50, { align: "center" });

    doc.addPage([86, 54], "portrait");
    doc.setFillColor(26, 82, 118);
    doc.rect(0, 0, 86, 54, "F");
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(3, 3, 80, 48, 2, 2, "F");

    doc.setTextColor(26, 82, 118);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("TASSA STAFF IDENTIFICATION", 43, 10, { align: "center" });

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
    instructions.forEach((line) => { doc.text(line, 43, yPos, { align: "center" }); yPos += 3; });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(6);
    doc.setTextColor(26, 82, 118);
    doc.text("D.M.Manumba", 43, 42, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(5);
    doc.text("TASSA Coordinator", 43, 46, { align: "center" });
    doc.line(20, 48, 66, 48);

    doc.save(`TASSA_ID_${staffName.replace(/\s+/g, "_")}.pdf`);
    toast({ title: "ID Card Generated", description: "Staff ID card has been downloaded" });
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

        {/* Logo + Background Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Certificate Logo
              </CardTitle>
              <CardDescription>Optional logo shown at the top of certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <Button variant="outline" onClick={() => logoInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  {logoFileName || "Upload Logo"}
                </Button>
                {logoDataUrl && (
                  <div className="flex items-center gap-3">
                    <img src={logoDataUrl} alt="Logo preview" className="h-12 w-12 object-contain rounded border" />
                    <Button variant="ghost" size="sm" onClick={() => { setLogoDataUrl(null); setLogoFileName(""); }}>Remove</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Custom Background
              </CardTitle>
              <CardDescription>Replace the default certificate template (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
                <Button variant="outline" onClick={() => bgInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  {bgFileName || "Upload Background"}
                </Button>
                {bgDataUrl && (
                  <div className="flex items-center gap-3">
                    <img src={bgDataUrl} alt="Background preview" className="h-12 w-16 object-cover rounded border" />
                    <Button variant="ghost" size="sm" onClick={() => { setBgDataUrl(null); setBgFileName(""); }}>Reset</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appreciation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appreciation" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Appreciation Certificate
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

          {/* Appreciation Certificate Tab */}
          <TabsContent value="appreciation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certificate of Appreciation
                </CardTitle>
                <CardDescription>Generate certificates using the template. Edit any text below.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Certificate Title</Label>
                    <Input value={certTitle} onChange={(e) => setCertTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input value={certSubtitle} onChange={(e) => setCertSubtitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Certificate For</Label>
                    <Select value={recipientType} onValueChange={(v: "teacher" | "student") => setRecipientType(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher"><div className="flex items-center gap-2"><Users className="h-4 w-4" />Teacher</div></SelectItem>
                        <SelectItem value="student"><div className="flex items-center gap-2"><Award className="h-4 w-4" />Student</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{recipientType === "teacher" ? "Teacher's" : "Student's"} Full Name</Label>
                    <Input placeholder="Enter full name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Introduction Text</Label>
                    <Input value={certIntro} onChange={(e) => setCertIntro(e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Body Text</Label>
                    <Textarea value={certBody} onChange={(e) => setCertBody(e.target.value)} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Event / Occasion (optional)</Label>
                    <Input value={certEvent} onChange={(e) => setCertEvent(e.target.value)} placeholder="e.g. TASSA Series 6" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location (optional)</Label>
                    <Input value={certLocation} onChange={(e) => setCertLocation(e.target.value)} placeholder="e.g. Dar es Salaam" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date Issued</Label>
                    <Input type="date" value={certDate} onChange={(e) => setCertDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Signer Name</Label>
                    <Input value={certSignName} onChange={(e) => setCertSignName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Signer Title</Label>
                    <Input value={certSignTitle} onChange={(e) => setCertSignTitle(e.target.value)} />
                  </div>
                </div>

                {/* Live Preview */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Live Preview</Label>
                  <div
                    className="relative w-full aspect-[297/210] rounded-lg border border-border overflow-hidden shadow-md bg-card"
                    style={{
                      backgroundImage: `url(${bgDataUrl || certificateTemplateBg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-[6%] py-[4%]">
                      {logoDataUrl && (
                        <img src={logoDataUrl} alt="logo" className="h-[14%] object-contain mb-2" />
                      )}
                      <h3 className="text-[3.5cqw] md:text-3xl font-bold text-primary tracking-wider">{certTitle}</h3>
                      <p className="text-[2cqw] md:text-base text-accent font-medium">{certSubtitle}</p>
                      <p className="mt-3 text-[1.4cqw] md:text-sm text-muted-foreground">{certIntro}</p>
                      <p className="mt-1 text-[3cqw] md:text-2xl font-bold text-foreground border-b-2 border-foreground/40 pb-1 px-4">
                        {recipientName.toUpperCase() || "RECIPIENT NAME"}
                      </p>
                      <p className="mt-3 text-[1.2cqw] md:text-xs text-muted-foreground max-w-[80%] whitespace-pre-line">{certBody}</p>
                      {(certEvent || certLocation) && (
                        <p className="mt-2 text-[1.2cqw] md:text-xs text-foreground/70">
                          {[certEvent, certLocation].filter(Boolean).join(" — ")}
                        </p>
                      )}
                      <div className="mt-auto w-full flex justify-between items-end text-[1.1cqw] md:text-xs">
                        <div className="text-left">
                          <p className="text-muted-foreground">Date: {certDate}</p>
                          <div className="border-t border-foreground/40 w-32 mt-1" />
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{certSignName}</p>
                          <p className="text-accent">{certSignTitle}</p>
                          <div className="border-t border-foreground/40 w-40 mt-1 ml-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={generateAppreciationCertificate} className="w-full md:w-auto">
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
                <CardDescription>Generate excellence certificates for top-performing schools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Certificate Title</Label>
                    <Input value={schoolCertTitle} onChange={(e) => setSchoolCertTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input value={schoolCertSubtitle} onChange={(e) => setSchoolCertSubtitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>School Name</Label>
                    <Input placeholder="Enter school name" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Input placeholder="Enter region" value={schoolRegion} onChange={(e) => setSchoolRegion(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Position Achieved</Label>
                    <Select value={schoolPosition} onValueChange={setSchoolPosition}>
                      <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n}{n===1?"st":n===2?"nd":n===3?"rd":"th"} Position</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Series Number</Label>
                    <Select value={schoolSeries} onValueChange={setSchoolSeries}>
                      <SelectTrigger><SelectValue placeholder="Select series" /></SelectTrigger>
                      <SelectContent>
                        {[5,6,7,8].map(n => (<SelectItem key={n} value={n.toString()}>Series {n}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Introduction Text</Label>
                    <Input value={schoolCertIntro} onChange={(e) => setSchoolCertIntro(e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Body Text</Label>
                    <Textarea value={schoolCertBody} onChange={(e) => setSchoolCertBody(e.target.value)} rows={3} />
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
                <CardDescription>Generate identification cards for TASSA staff members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Staff Full Name</Label>
                    <Input placeholder="Enter staff full name" value={staffName} onChange={(e) => setStaffName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select value={staffPosition} onValueChange={setStaffPosition}>
                      <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                      <SelectContent>
                        {["Chairman","Vice Chairman","Secretary General","Treasurer","Academic Coordinator","Regional Coordinator","Subject Coordinator","IT Administrator","Office Assistant"].map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={staffDepartment} onValueChange={setStaffDepartment}>
                      <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                      <SelectContent>
                        {["Administration","Academic","Finance","IT & Communications","Regional Affairs"].map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>ID Number</Label>
                    <Input placeholder="e.g., TASSA-2026-001" value={staffIdNumber} onChange={(e) => setStaffIdNumber(e.target.value)} />
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
