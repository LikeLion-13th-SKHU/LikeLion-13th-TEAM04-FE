import styled from "styled-components";
import { colors } from "../../styles/theme";

interface MyPageHeaderProps {
  userName: string;
  userRole: string;
}

export default function MyPageHeader({ userName, userRole }: MyPageHeaderProps) {
  return (
    <Header>
      <HeaderLeft>
        <LogoSquare />
        <BrandText>청상회</BrandText>
      </HeaderLeft>
      <MatchButton href="/ai-match" aria-label="AI 챗봇으로 청년·상인 매칭">
        청년·상인 AI 매칭
      </MatchButton>
      <HeaderRight>
        <UserInfo>
          <UserRole>{userRole}</UserRole>
          <UserName>{userName}님</UserName>
        </UserInfo>
      </HeaderRight>
    </Header>
  );
}

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 3.75rem;
  padding: 0 5rem;
  background-color: ${colors.white};
  border-bottom: 0.0625rem solid ${colors.blue[300]};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
`;

const LogoSquare = styled.div`
  width: 1.575rem;
  height: 1.875rem;
  background: linear-gradient(
    180deg,
    ${colors.blue[900]} 0%,
    #16338f 60%,
    #0a123a 100%
  );
  border-radius: 0.1875rem;
`;

const BrandText = styled.span`
  font-weight: 800;
  font-size: 1.5rem;
  line-height: 1;
  background: linear-gradient(180deg, ${colors.blue[900]} 0%, #1b2f84 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeaderRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${colors.gray[900]};
`;

const UserRole = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${colors.blue[900]};
  line-height: 1;
`;

const UserName = styled.div`
  font-size: 1rem;
`;

const MatchButton = styled.a`
  margin-left: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${colors.blue[900]};
  color: ${colors.white};
  text-decoration: none;
  line-height: 1;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${colors.blue[700]};
  }
`;
