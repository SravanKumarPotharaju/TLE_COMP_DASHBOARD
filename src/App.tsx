import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SatelliteProvider } from "@/contexts/SatelliteContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SatelliteDetail from "./pages/SatelliteDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SatelliteProvider>
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/satellite/:noradId" element={<SatelliteDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </SatelliteProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
