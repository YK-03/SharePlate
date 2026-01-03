import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DonorDashboard from "./pages/DonorDashboard";
import RecipientDashboard from "./pages/RecipientDashboard";

import HowItWorks from "./pages/HowItWorks";
import SignupSuccess from "./pages/SignupSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/how-it-works" element={<HowItWorks />} />

          {/* SIGNUP SUCCESS PAGE */}
          <Route path="/signup-success" element={<SignupSuccess />} />

          {/* Dashboards */}
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/recipient" element={<RecipientDashboard />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
