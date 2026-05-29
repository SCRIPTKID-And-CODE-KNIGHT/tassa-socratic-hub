import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/Reveal";

const sections = [
  {
    id: "terms",
    title: "Terms & Conditions",
    body: [
      "By accessing or using the TASSA platform you agree to these Terms. The platform is provided for the registered schools, teachers, students and authorized partners of the Tanzania Advanced Socratic Schools Association.",
      "You agree to provide accurate registration details, to keep your login credentials confidential, and to use the platform only for lawful educational purposes. TASSA may suspend accounts that misuse the service, attempt unauthorized access, upload fraudulent results, or violate Tanzanian law.",
      "All exam materials, almanacs, certificates, branding and content remain the intellectual property of TASSA and may not be redistributed without written permission.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    body: [
      "TASSA collects only the information needed to run the academic series: school details, contact information, student results, payment confirmations and submitted documents.",
      "Data is stored securely on managed cloud infrastructure with row-level access controls. We never sell personal data. Information may be shared with regulators or partner schools strictly when required for the running of an academic series.",
      "You may request access, correction or deletion of your personal data by contacting admin@tassa.ac.tz.",
    ],
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    body: [
      "TASSA uses a small number of cookies and local storage entries to keep you signed in, remember your preferences, and measure how the platform is used so we can improve it.",
      "Essential cookies are required for authentication and cannot be disabled. Analytics and advertising cookies (e.g. Google AdSense) can be controlled through your browser settings.",
    ],
  },
  {
    id: "notice",
    title: "Legal Notice",
    body: [
      "Publisher: Tanzania Advanced Socratic Schools Association (TASSA), Geita - Tanzania.",
      "Contact: admin@tassa.ac.tz · +255 752 837 561.",
      "All content on this website is published in good faith and for general educational information. TASSA is not liable for any decision taken solely on the basis of information on this site. External links are provided for convenience and do not imply endorsement.",
    ],
  },
];

const LegalPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">
              Legal Information
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The terms, privacy and legal notices that govern your use of the
              TASSA platform.
            </p>
          </div>
        </Reveal>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <Card id={s.id} className="scroll-mt-24">
                <CardHeader>
                  <CardTitle>{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  {s.body.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </CardContent>
              </Card>
            </Reveal>
          ))}

          <p className="text-xs text-muted-foreground text-center pt-4">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;