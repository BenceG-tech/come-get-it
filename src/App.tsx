
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Vendeglatohelyek from "./pages/Vendeglatohelyek";
import Italmarkak from "./pages/Italmarkak";
import RewardsPartners from "./pages/RewardsPartners";
import ComeGetItAccelerator from "./pages/ComeGetItAccelerator";
import NotFound from "./pages/NotFound";
import AdatvedelmiSzabalyzat from "./pages/AdatvedelmiSzabalyzat";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/vendeglatohelyek" element={<Vendeglatohelyek />} />
              <Route path="/italmarkak" element={<Italmarkak />} />
              <Route path="/rewards-partners" element={<RewardsPartners />} />
              <Route path="/come-get-it-accelerator" element={<ComeGetItAccelerator />} />
              <Route path="/adatvedelmi-szabalyzat" element={<AdatvedelmiSzabalyzat />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
