import { useState, useEffect } from "react";
import styled from "styled-components";
import InfoCard from "../components/mypage/InfoCard";
import PostsView from "../components/posts/PostsView";
import PortfolioView from "../components/portfolio/PortfolioView";
import PortfolioCreateView from "../components/portfolio/PortfolioCreateView";
import { MyPostsButton, PortfolioViewButton } from "../components/portfolio/ActionButtons";
import PageTitle from "../components/common/PageTitle";
import { colors } from "../styles/theme";
import { User } from "../types/user";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const { user, isAuthenticated, updateUserNickname } = useAuth();
  const navigate = useNavigate();
  
  // 공고 모아보기 모드 상태 관리
  const [showPosts, setShowPosts] = useState(false);
   
  // 포트폴리오 생성 모드 상태 관리
  const [showPortfolioCreate, setShowPortfolioCreate] = useState(false);
  
  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 인증되지 않았거나 user 정보가 없는 경우 아무것도 렌더링하지 않음
  if (!isAuthenticated || !user) {
    return null;
  }

  // 닉네임 변경 처리
  const handleNicknameChange = (newNickname: string) => {
    // AuthContext의 updateUserNickname 함수 사용
    updateUserNickname(newNickname);
  };

  // 사용자 정보에서 점수와 등급 가져오기
  const currentScore = user?.score || 0;
  const currentGrade = user?.grade || "브론즈";

  return (
    <MyPageContainer>
      <MainContent>
        {/* 상인일 때만 표시되는 내 공고 모아보기 버튼 */}
        {user.role === "상인" && (
          <MyPostsButton onClick={() => setShowPosts(!showPosts)}>
            {showPosts ? "회원정보로 돌아가기" : "내 공고 모아보기"}
          </MyPostsButton>
        )}
        
        {/* 청년일 때만 표시되는 포트폴리오 관련 버튼들 */}
        {user.role === "청년" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
            <PortfolioViewButton onClick={() => {
              if (showPosts) {
                setShowPosts(false);
                setShowPortfolioCreate(false);
              } else {
                setShowPosts(true);
                setShowPortfolioCreate(true);
              }
            }}>
              {showPosts ? "회원정보로 돌아가기" : "포트폴리오 관리"}
            </PortfolioViewButton>
          </div>
        )}
        
        {!showPosts ? (
          <>
            <PageTitle>{(user.nickname || user.name)} 님의 청상회 회원정보</PageTitle>
            <InfoCard 
              userName={user.nickname || user.name} 
              userId={user.id}
              currentScore={currentScore} 
              currentGrade={currentGrade}
              onNicknameChange={handleNicknameChange}
            />
          </>
        ) : showPortfolioCreate ? (
          <PortfolioCreateView 
            testUser={user} 
            onClose={() => setShowPortfolioCreate(false)}
          />
        ) : (
          user.role === "상인" ? (
            <PostsView testUser={user} />
          ) : (
            <PortfolioView testUser={user} />
          )
        )}
      </MainContent>
    </MyPageContainer>
  );
}

const MyPageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.white};
`;

const MainContent = styled.main`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;


















