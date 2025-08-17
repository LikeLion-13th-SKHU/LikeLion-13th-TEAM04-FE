import { useState } from "react";
import styled from "styled-components";
import MyPageHeader from "../components/mypage/MyPageHeader";
import InfoCard from "../components/mypage/InfoCard";
import PostsView from "../components/posts/PostsView";
import PortfolioView from "../components/portfolio/PortfolioView";
import PortfolioCreateView from "../components/portfolio/PortfolioCreateView";
import { MyPostsButton, PortfolioViewButton } from "../components/portfolio/ActionButtons";
import PageTitle from "../components/common/PageTitle";
import { colors } from "../styles/theme";
import { User } from "../types/user";

export default function MyPage() {
  // 마이페이지에서만 테스트용 사용자 정보 사용
  const testUser: User = {
    id: "1",
    name: "박성준",
    profileImageUrl: "https://via.placeholder.com150",
    role: "상인" // 청년으로 변경. 상인으로 변경 시 상인 전용 화면 뜸.
  };

  // 공고 모아보기 모드 상태 관리
  const [showPosts, setShowPosts] = useState(false);
   
  // 포트폴리오 생성 모드 상태 관리
  const [showPortfolioCreate, setShowPortfolioCreate] = useState(false);

  // 현재 점수 (임시로 100점 설정)
  const currentScore = 100;

  // 점수에 따른 등급 계산 함수
  const getGrade = (score: number) => {
    if (score >= 100) return "다이아몬드";
    if (score >= 51) return "플래티넘";
    if (score >= 31) return "골드";
    if (score >= 11) return "실버";
    if (score >= 0) return "브론즈";
    return "브론즈";
  };

  const currentGrade = getGrade(currentScore);

  return (
    <MyPageContainer>
      {/* 마이페이지 전용 헤더 */}
      <MyPageHeader userName={testUser.name} userRole={testUser.role} />

      <MainContent>
        {/* 상인일 때만 표시되는 내 공고 모아보기 버튼 */}
        {testUser.role === "상인" && (
          <MyPostsButton onClick={() => setShowPosts(!showPosts)}>
            {showPosts ? "회원정보로 돌아가기" : "내 공고 모아보기"}
          </MyPostsButton>
        )}
        
        {/* 청년일 때만 표시되는 포트폴리오 관련 버튼들 */}
        {testUser.role === "청년" && (
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
            <PageTitle>{testUser.name} 님의 청상회 회원정보</PageTitle>
            <InfoCard userName={testUser.name} currentScore={currentScore} currentGrade={currentGrade} />
          </>
        ) : showPortfolioCreate ? (
          <PortfolioCreateView 
            testUser={testUser} 
            onClose={() => setShowPortfolioCreate(false)}
          />
        ) : (
          testUser.role === "상인" ? (
            <PostsView testUser={testUser} />
          ) : (
            <PortfolioView testUser={testUser} />
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


















