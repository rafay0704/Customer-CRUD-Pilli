import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";
import CustomerDetail from "./pages/CustomerDetail";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
