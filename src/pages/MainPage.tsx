import styled from "styled-components";

const MainContainer = styled.main`
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  margin-top: 60px;
`;

const WelcomeText = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

export default function MainPage() {
  return (
    <MainContainer>
      <WelcomeText>청상회에 오신 것을 환영합니다!</WelcomeText>
    </MainContainer>
  );
}
