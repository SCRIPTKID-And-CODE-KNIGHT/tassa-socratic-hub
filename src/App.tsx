import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "@/components/Navigation";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ResultsPage from "./pages/ResultsPage";
import PastResultsPage from "./pages/PastResultsPage";
import RegistrationPage from "./pages/RegistrationPage";
import RegisteredSchoolsPage from "./pages/RegisteredSchoolsPage";
import ParticipationPage from "./pages/ParticipationPage";
import ParticipationConfirmationPage from "./pages/ParticipationConfirmationPage";
import ContactPage from "./pages/ContactPage";
import PaymentStatusPage from './pages/admin/PaymentStatusPage';
import StoreMaterialsPage from './pages/admin/StoreMaterialsPage';
import AnnouncementsManagementPage from './pages/admin/AnnouncementsManagementPage';
import ResultsManagementPage from './pages/admin/ResultsManagementPage';
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/past-results" element={<PastResultsPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/registered-schools" element={<RegisteredSchoolsPage />} />
          <Route path="/participation" element={<ParticipationPage />} />
          <Route path="/participation-confirmation" element={<ParticipationConfirmationPage />} />
            <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/payments" element={<PaymentStatusPage />} />
          <Route path="/admin/store" element={<StoreMaterialsPage />} />
          <Route path="/admin/announcements" element={<AnnouncementsManagementPage />} />
          <Route path="/admin/results" element={<ResultsManagementPage />} />
          <Route path="/auth" element={<AuthPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
