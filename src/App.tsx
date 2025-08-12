import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
