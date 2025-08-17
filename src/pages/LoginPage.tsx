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
    // 나중에 실제 OAuth 시작 로직 연결
    console.log("구글 로그인 시작");
    // window.location.href = "/api/auth/google";  // 예시
  };

  return (
    <Full>
      <LoginCard onGoogleClick={handleGoogle} />
    </Full>
  );
}