import styled from "styled-components";
import LoginCard from "../components/auth/LoginCard";

const Full = styled.main`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 clamp(12px, 3vw, 16px);
  background: ${({ theme }) => theme.colors.white};

  @media (max-width: 768px) {
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    padding: 0 8px;
  }
`;

export default function LoginPage() {
  const handleGoogle = () => {
    console.log("구글 로그인 시작");
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?
		client_id=${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
		&redirect_uri=${process.env.REACT_APP_GOOGLE_AUTH_REDIRECT_URI}
		&response_type=code
		&scope=email profile`;
  };

  return (
    <Full>
      <LoginCard onGoogleClick={handleGoogle} />
    </Full>
  );
}