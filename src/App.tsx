import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Header />
        <main>{/* 페이지 콘텐츠가 여기에 렌더링됩니다. */}</main>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
