import { ThemeProvider } from "./contexts/theme-provider";
import SignupPage from "./pages/signup";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SignupPage />
    </ThemeProvider>
  );
}

export default App;
