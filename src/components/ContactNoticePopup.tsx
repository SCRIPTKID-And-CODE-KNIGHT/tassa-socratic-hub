import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Phone } from "lucide-react";

const STORAGE_KEY = "contact-notice-dismissed-v1";

export const ContactNoticePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const t = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) sessionStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
            <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Taarifa Muhimu
          </DialogTitle>
          <DialogDescription className="text-center text-base leading-relaxed pt-2">
            Ikiwa unapata changamoto kutupata kupitia namba zetu za kawaida,
            tafadhali wasiliana nasi kupitia namba mpya{" "}
            <span className="inline-flex items-center gap-1 font-semibold text-foreground whitespace-nowrap">
              <Phone className="h-4 w-4" aria-hidden="true" />
              0638242297
            </span>{" "}
            kwa huduma ya haraka.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <a
            href="tel:+255638242297"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => sessionStorage.setItem(STORAGE_KEY, "1")}
          >
            📞 Piga Sasa
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactNoticePopup;