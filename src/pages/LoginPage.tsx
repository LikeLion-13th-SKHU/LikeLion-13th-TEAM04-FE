import styled from "styled-components";
import LoginCard from "../components/LoginCard";

const Full = styled.main`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 clamp(12px, 3vw, 16px);
  background: ${({ theme }) => theme.colors.white};
  transform: translateY(-30px); 

  @media (max-width: 768px) {
    transform: translateY(-20px);
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    transform: translateY(-15px);
    padding: 0 8px;
  }
`;

export default function LoginPage() {
  const handleGoogle = () => {
    // TODO: 실제 OAuth 시작 로직 연결
    console.log("구글 로그인 시작");
    // window.location.href = "/api/auth/google";  // 예시
  };

  return (
    <Full>
      <LoginCard onGoogleClick={handleGoogle} />
    </Full>
  );
}