import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import AIMatchChatPage from "./pages/AIMatchChatPage";
import ChatListPage from "./pages/ChatListPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import NoticeListPage from "./pages/NoticeListPage";
import NoticeDetailPage from "./pages/NoticeDetailPage";
import NoticeCreatePage from "./pages/NoticeCreatePage";
import MyPage from "./pages/MyPage";
import PortfolioListPage from "./pages/PortfolioListPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";

import OauthCallback from "./pages/OauthCallback";

function AppContent() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/oauth2/callback/google" element={<OauthCallback />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/ai-match" element={<AIMatchChatPage />} />

        {/* 사용자 간 채팅 라우트 */}
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/chat/:chatRoomId" element={<ChatRoomPage />} />

        <Route path="/notices" element={<NoticeListPage />} />
        <Route path="/notices/:id" element={<NoticeDetailPage />} />
        <Route path="/notices/new" element={<NoticeCreatePage />} />

        <Route path="/me" element={<MyPage />} />
                            <Route path="/portfolios" element={<PortfolioListPage />} />
                    <Route path="/portfolios/:portfolioId" element={<PortfolioDetailPage />} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
