import { Link } from "react-router-dom";
import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type FooterLink = { label: string; to: string; external?: boolean };

const aboutLinks: FooterLink[] = [
  { label: "About TASSA", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Almanac", to: "/almanac" },
  { label: "Mission & Vision", to: "/about#mission" },
];

const quickLinks: FooterLink[] = [
  { label: "View Results", to: "/results" },
  { label: "Submit Results", to: "/submit-results" },
  { label: "Register School", to: "/registration" },
  { label: "Registered Schools", to: "/registered-schools" },
];

const legalLinks: FooterLink[] = [
  { label: "Terms & Conditions", to: "/legal#terms" },
  { label: "Privacy Policy", to: "/legal#privacy" },
  { label: "Cookie Policy", to: "/legal#cookies" },
  { label: "Legal Notice", to: "/legal#notice" },
];

const supportLinks: FooterLink[] = [
  { label: "Help Center", to: "/contact#help" },
  { label: "FAQs", to: "/contact#faqs" },
  { label: "Report Issue", to: "/contact#report" },
];

const socials = [
  { label: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { label: "WhatsApp", icon: MessageCircle, href: "https://wa.me/255000000000" },
  { label: "YouTube", icon: Youtube, href: "https://youtube.com" },
];

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground hover:translate-x-1 inline-block transition-all duration-200"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({
      title: "Subscribed!",
      description: "Thanks for subscribing to TASSA updates.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-[image:var(--gradient-hero)] text-primary-foreground border-t border-primary-foreground/10 flex-grow flex flex-col">
      {/* Gradient separator */}
      <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="container mx-auto sm:px-6 lg:py-16 px-[2px] py-[6px] flex-grow flex flex-col">
        {/* Top: brand + newsletter */}
        <div className="grid gap-10 lg:grid-cols-3 mb-12 pb-10 border-b border-primary-foreground/10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/15">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base">TASSA</span>
                <span className="text-[11px] opacity-70">Advanced Socratic Schools</span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-md leading-relaxed">
              Empowering academic excellence through comprehensive educational
              competitions across Tanzania.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
              Subscribe for updates
            </h3>
            <p className="text-xs text-primary-foreground/70 mb-3">
              Get the latest exam schedules, results, and announcements.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-accent"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-accent text-accent-foreground hover:opacity-90 shrink-0"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Link columns */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12"
        >
          <FooterColumn title="About" links={aboutLinks} />
          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
          <FooterColumn title="Support" links={supportLinks} />

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h3>
            <address className="not-italic space-y-2.5 text-sm text-primary-foreground/70">
              <a
                href="mailto:info@tassa.or.tz"
                className="flex items-start gap-2 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <span>info@tassa.or.tz</span>
              </a>
              <a
                href="tel:+255000000000"
                className="flex items-start gap-2 hover:text-primary-foreground transition-colors"
              >
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <span>+255 752 837 561</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Geita - Tanzania</span>
              </div>
            </address>
          </div>
        </nav>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-primary-foreground/10">
          <p className="text-xs text-primary-foreground/70 text-center sm:text-left">
            © 2026 Tanzania Advanced Socratic Schools Association. All Rights Reserved.
          </p>
          <ul className="flex items-center gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-accent hover:scale-110 transition-all duration-200"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;