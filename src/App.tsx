
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
import Partnerek from "./pages/Partnerek";
import ComeGetItAccelerator from "./pages/ComeGetItAccelerator";
import NotFound from "./pages/NotFound";
import AdatvedelmiSzabalyzat from "./pages/AdatvedelmiSzabalyzat";
import { AdminRoute } from "./components/admin/AdminRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminPartnerDetail from "./pages/admin/AdminPartnerDetail";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminDocumentViewer from "./pages/admin/AdminDocumentViewer";
import AdminDocumentsAudit from "./pages/admin/AdminDocumentsAudit";
import AdminChecklist from "./pages/admin/AdminChecklist";
import AdminAI from "./pages/admin/AdminAI";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminDocumentChat from "./pages/admin/AdminDocumentChat";
import AdminDrive from "./pages/admin/AdminDrive";
import AdminBrand from "./pages/admin/AdminBrand";
import AdminContentStudio from "./pages/admin/AdminContentStudio";
import AdminRetro from "./pages/admin/AdminRetro";
import AdminOutreach from "./pages/admin/AdminOutreach";
import AdminInbox from "./pages/admin/AdminInbox";
import AdminSimulator from "./pages/admin/AdminSimulator";

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
              <Route path="/partnerek" element={<Partnerek />} />
              <Route path="/come-get-it-accelerator" element={<ComeGetItAccelerator />} />
              <Route path="/adatvedelmi-szabalyzat" element={<AdatvedelmiSzabalyzat />} />
              <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
              <Route path="/admin/leads" element={<AdminRoute><AdminLayout><AdminLeads /></AdminLayout></AdminRoute>} />
              <Route path="/admin/partners" element={<AdminRoute><AdminLayout><AdminPartners /></AdminLayout></AdminRoute>} />
              <Route path="/admin/partners/:id" element={<AdminRoute><AdminLayout><AdminPartnerDetail /></AdminLayout></AdminRoute>} />
              <Route path="/admin/documents" element={<AdminRoute><AdminLayout><AdminDocuments /></AdminLayout></AdminRoute>} />
              <Route path="/admin/documents/chat" element={<AdminRoute><AdminLayout><AdminDocumentChat /></AdminLayout></AdminRoute>} />
              <Route path="/admin/documents/audit" element={<AdminRoute><AdminLayout><AdminDocumentsAudit /></AdminLayout></AdminRoute>} />
              <Route path="/admin/documents/:id" element={<AdminRoute><AdminLayout><AdminDocumentViewer /></AdminLayout></AdminRoute>} />
              <Route path="/admin/media" element={<AdminRoute><AdminLayout><AdminMedia /></AdminLayout></AdminRoute>} />
              <Route path="/admin/drive" element={<AdminRoute><AdminLayout><AdminDrive /></AdminLayout></AdminRoute>} />
              <Route path="/admin/checklist" element={<AdminRoute><AdminLayout><AdminChecklist /></AdminLayout></AdminRoute>} />
              <Route path="/admin/ai" element={<AdminRoute><AdminLayout><AdminAI /></AdminLayout></AdminRoute>} />
              <Route path="/admin/ai/:threadId" element={<AdminRoute><AdminLayout><AdminAI /></AdminLayout></AdminRoute>} />
              <Route path="/admin/calendar" element={<AdminRoute><AdminLayout><AdminCalendar /></AdminLayout></AdminRoute>} />
              <Route path="/admin/brand" element={<AdminRoute><AdminLayout><AdminBrand /></AdminLayout></AdminRoute>} />
              <Route path="/admin/content" element={<AdminRoute><AdminLayout><AdminContentStudio /></AdminLayout></AdminRoute>} />
              <Route path="/admin/retro" element={<AdminRoute><AdminLayout><AdminRetro /></AdminLayout></AdminRoute>} />
              <Route path="/admin/outreach" element={<AdminRoute><AdminLayout><AdminOutreach /></AdminLayout></AdminRoute>} />
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
