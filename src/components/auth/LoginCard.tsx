import { ReactNode } from "react";
import styled from "styled-components";

const LoginCard = ({ children }: Props) => {
  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GOOGLE_AUTH_REDIRECT_URI;
    
    if (!clientId) {
      alert('Google Client ID가 설정되지 않았습니다. .env 파일을 확인해주세요.');
      return;
    }
    
    if (!redirectUri) {
      alert('Google Redirect URI가 설정되지 않았습니다. .env 파일을 확인해주세요.');
      return;
    }
    
    const scope = 'email profile';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
      window.location.href = googleAuthUrl;
  };

  return (
    <Card role="dialog" aria-labelledby="login-title">
      <Title id="login-title">로그인/회원가입</Title>
      <Actions>
        <GoogleButton onClick={handleGoogleLogin} aria-label="Google로 시작하기">
          <GoogleIcon />
          <span>Google로 시작하기</span>
        </GoogleButton>
        {children}
      </Actions>
    </Card>
  );
};

export default LoginCard;

const Card = styled.section`
  width: min(92vw, ${({ theme }) => theme.size.cardW});
  max-width: 400px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radius.card};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: clamp(24px, 6vw, 32px) clamp(20px, 4vw, 24px);
  text-align: center;
`;

const Title = styled.h1`
  font-size: clamp(18px, 4vw, 20px);
  font-weight: 600;
  letter-spacing: -0.025em;
  margin: 0 0 clamp(20px, 5vw, 24px);
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Actions = styled.div`
  display: grid;
  gap: clamp(12px, 3vw, 16px);
`;

const GoogleButton = styled.button`
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  gap: clamp(10px, 2.5vw, 12px);

  width: 100%;
  padding: clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px);
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.btnBorder};
  border-radius: ${({ theme }) => theme.radius.button};
  cursor: pointer;
  font-size: clamp(13px, 3vw, 14px);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};

  transition: all 0.2s ease;
  &:hover { 
    background: ${({ theme }) => theme.colors.btnHover};
    border-color: ${({ theme }) => theme.colors.blue[300]};
  }
  &:active { transform: translateY(1px); }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  span { 
    justify-self: start;
    font-family: inherit;
  }

  @media (max-width: 480px) {
    grid-template-columns: 18px 1fr;
    gap: 10px;
  }
`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.5 29.3 36 24 36 16.8 36 11 30.2 11 23S16.8 10 24 10c3.6 0 6.8 1.4 9.2 3.7l5.7-5.7C35.4 4.6 30 2 24 2 12 2 2 12 2 24s10 22 22 22c11.3 0 20.7-8.2 21.6-19 0-.5 0-1-.1-1.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.3 18.9 14 24 14c3.6 0 6.8 1.4 9.2 3.7l5.7-5.7C35.4 4.6 30 2 24 2 15.4 2 8 6.8 4 14.1z"/>
    <path fill="#4CAF50" d="M24 46c6 0 11.4-2.3 15.4-6.1l-5.7-4.7C31.4 37.4 28.1 39 24 39c-5.2 0-9.5-3.3-11.1-7.9l-6.6 5.1C8 41.3 15.4 46 24 46z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-4.5 7-11.3 7-5.2 0-9.5-3.3-11.1-7.9l-6.6 5.1C8 41.3 15.4 46 24 46c11.3 0 20.7-8.2 21.6-19 0-.5 0-1-.1-1.5z"/>
  </svg>
);

type Props = {
  onGoogleClick?: () => void;
  children?: ReactNode;
};
