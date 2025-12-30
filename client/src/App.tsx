import { ThemeProvider } from "./contexts/theme-provider";
import { RouterProvider } from "react-router";
import router from "@/routes/routes";
import { QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./contexts/auth-provider";
import { Toaster } from "./components/ui/sonner";
import { queryClient } from "./utils/queryClient";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
