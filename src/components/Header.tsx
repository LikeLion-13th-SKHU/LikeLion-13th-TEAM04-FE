import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../styles/theme";
import { ReactComponent as ChatIconSvg } from "../assets/icons/chat.svg";
import { ReactComponent as BellIconSvg } from "../assets/icons/bell.svg";

const Header = () => {
  const { user } = useAuth();

  return (
    <HeaderRoot>
      <HomeLink to="/" aria-label="청상회 홈">
        <LogoSquare aria-hidden={true} />
        <BrandText>청상회</BrandText>
      </HomeLink>

      <MatchButton to="/ai-match" aria-label="AI 챗봇으로 청년·상인 매칭">
        청년·상인 AI 매칭
      </MatchButton>

      <RightArea aria-label="사용자">
        {user ? (
          <>
            <Actions>
              <IconLink to="/messages" aria-label="채팅">
                <ChatIcon aria-hidden={true} />
              </IconLink>
              <IconLink to="/notifications" aria-label="알림">
                <BellIcon aria-hidden={true} />
              </IconLink>
            </Actions>

            <ProfileArea to="/me" aria-label="내 프로필">
              <Avatar aria-hidden={true} src={user.profileImageUrl} />
              <div>
                <UserRole>{user.role}</UserRole>
                <UserName>{user.name}</UserName>
              </div>
            </ProfileArea>
          </>
        ) : (
          <AuthLink to="/login">로그인/회원가입</AuthLink>
        )}
      </RightArea>
    </HeaderRoot>
  );
};

export default Header;

const HeaderRoot = styled.header`
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

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  text-decoration: none;
`;

const MatchButton = styled(Link)`
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

const RightArea = styled.nav`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Actions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconLink = styled(Link)`
  display: inline-flex;
  color: ${colors.gray[900]};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${colors.blue[900]};
  }
`;

const ChatIcon = styled(ChatIconSvg)`
  width: 1.5rem;
  height: 1.5rem;

  * {
    fill: currentColor;
  }
`;

const BellIcon = styled(BellIconSvg)`
  width: 1.5rem;
  height: 1.5rem;

  * {
    stroke: currentColor;
  }
`;

const AuthLink = styled(Link)`
  color: ${colors.gray[900]};
  font-size: 0.8125rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ProfileArea = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${colors.gray[900]};
`;

const Avatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  object-fit: cover;
  background: ${colors.gray[200]};
`;

const UserName = styled.span`
  font-size: 1rem;
`;

const UserRole = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${colors.blue[900]};
  line-height: 1;
`;
