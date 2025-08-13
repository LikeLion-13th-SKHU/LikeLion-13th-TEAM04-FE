import styled from "styled-components";
import { ReactComponent as SearchIcon } from "../assets/icons/search.svg";
import { ReactComponent as MenuIcon } from "../assets/icons/menu.svg";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow-left.svg";
import { ReactComponent as ArrowRightIcon } from "../assets/icons/arrow-right.svg";
import { ReactComponent as CafeIcon } from "../assets/icons/cafe.svg";
import { ReactComponent as ConvenienceIcon } from "../assets/icons/convenience.svg";
import { ReactComponent as DeliveryIcon } from "../assets/icons/delivery.svg";
import { ReactComponent as RestaurantIcon } from "../assets/icons/restaurant.svg";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function MainPage() {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { 
      id: 1, 
      type: "matching",
      title: "청년과 상인을 연결하는 AI 매칭",
      description: "챗봇과 대화하며 최적의 매칭을 찾아보세요",
      buttonText: "챗봇으로 매칭하기",
      buttonLink: "/ai-match"
    },
    { id: 2, type: "content", content: "두 번째 슬라이드" },
    { id: 3, type: "content", content: "세 번째 슬라이드" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <MainContainer>
      {/* 검색 및 필터 섹션 */}
      <SearchSection>
        <SearchRow>
          <MenuButton>
            <MenuIcon />
          </MenuButton>
          
          <SearchBar>
            <SearchIcon />
            <SearchInput placeholder="검색" />
          </SearchBar>
        </SearchRow>
        
        <FilterButtons>
          <FilterButton>지역</FilterButton>
          <FilterButton>종류</FilterButton>
          <FilterButton>경력</FilterButton>
          <FilterButton>학력</FilterButton>
          <FilterButton>고용기간</FilterButton>
          <FilterButton>근무형태</FilterButton>
        </FilterButtons>
      </SearchSection>

      {/* 캐러셀 섹션 */}
      <CarouselSection>
        <CarouselContainer>
          <CarouselButton onClick={prevSlide} $position="left">
            <ArrowLeftIcon />
          </CarouselButton>
          
          <CarouselContent>
            <CarouselTrack $currentSlide={currentSlide}>
              {slides.map((slide, index) => (
                <CarouselSlide key={slide.id} $isActive={index === currentSlide}>
                  {slide.type === "matching" ? (
                    <MatchingSlideCard>
                      <MatchingSlideContent>
                        <MatchingSlideTitle>{slide.title}</MatchingSlideTitle>
                        <MatchingSlideDescription>{slide.description}</MatchingSlideDescription>
                        <MatchingSlideButton href={slide.buttonLink}>
                          {slide.buttonText}
                        </MatchingSlideButton>
                      </MatchingSlideContent>
                    </MatchingSlideCard>
                  ) : (
                    <CarouselCard>
                      {slide.content}
                    </CarouselCard>
                  )}
                </CarouselSlide>
              ))}
            </CarouselTrack>
          </CarouselContent>
          
          <CarouselButton onClick={nextSlide} $position="right">
            <ArrowRightIcon />
          </CarouselButton>
        </CarouselContainer>
        <CarouselDots>
          {slides.map((_, index) => (
            <Dot 
              key={index} 
              $isActive={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </CarouselDots>
      </CarouselSection>

      {/* 메인 콘텐츠 섹션 */}
      <ContentSection>
        {/* 인기 카테고리 */}
        <CategorySection>
          <SectionHeader>
            <SectionTitle>인기 카테고리</SectionTitle>
            <ViewAllLink>전체보기 →</ViewAllLink>
          </SectionHeader>
          <CategoryGrid>
            <CategoryCard>
              <CategoryIcon>
                <CafeIcon />
              </CategoryIcon>
              <CategoryName>카페</CategoryName>
            </CategoryCard>
            <CategoryCard>
              <CategoryIcon>
                <ConvenienceIcon />
              </CategoryIcon>
              <CategoryName>편의점</CategoryName>
            </CategoryCard>
            <CategoryCard>
              <CategoryIcon>
                <DeliveryIcon />
              </CategoryIcon>
              <CategoryName>배달</CategoryName>
            </CategoryCard>
            <CategoryCard>
              <CategoryIcon>
                <RestaurantIcon />
              </CategoryIcon>
              <CategoryName>음식점</CategoryName>
            </CategoryCard>
          </CategoryGrid>
        </CategorySection>

        {/* 최신 채용 공고 */}
        <JobSection>
          <SectionHeader>
            <SectionTitle>최신 채용 공고</SectionTitle>
            <ViewAllLink>전체보기 →</ViewAllLink>
          </SectionHeader>
          <JobList>
            <JobCard>
              <JobHeader>
                <JobTitle>카페 ㅇㅇ점 파트타임 직원 모집</JobTitle>
                <JobSalary>시급 12,000</JobSalary>
              </JobHeader>
              <JobCompany>회사명</JobCompany>
              <JobTags>
                <JobTag>카페</JobTag>
                <JobTag>주말근무</JobTag>
                <JobTag>초보환영</JobTag>
              </JobTags>
            </JobCard>
            <JobCard>
              <JobHeader>
                <JobTitle>○○치킨집 홀서빙 직원 모집</JobTitle>
                <JobSalary>시급 12,000</JobSalary>
              </JobHeader>
              <JobCompany>회사명</JobCompany>
              <JobTags>
                <JobTag>음식점</JobTag>
                <JobTag>서빙</JobTag>
                <JobTag>경력무관</JobTag>
              </JobTags>
            </JobCard>
          </JobList>
        </JobSection>

        {/* 청년 포트폴리오 */}
        <PortfolioSection>
          <SectionHeader>
            <SectionTitle>청년 포트폴리오</SectionTitle>
          </SectionHeader>
          <PortfolioStats>
            <StatCard>
              <StatNumber>1,247</StatNumber>
              <StatLabel>등록된 포트폴리오</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>892</StatNumber>
              <StatLabel>활동중인 청년</StatLabel>
            </StatCard>
          </PortfolioStats>
        </PortfolioSection>
      </ContentSection>

      {/* 역할별 액션 버튼 */}
      {user && (
        <ActionSection>
          {user.role === "청년" ? (
            <ActionButton href="/resume">이력서 등록</ActionButton>
          ) : (
            <ActionButton href="/post-job">공고 등록</ActionButton>
          )}
        </ActionSection>
      )}
    </MainContainer>
  );
}

const MainContainer = styled.main`
  background: ${({ theme }) => theme.colors.white};
  margin-top: 0;
  padding: 1rem;
  min-height: calc(100vh - 60px);
  
  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 1rem 5rem;
  }
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  position: relative;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 0.75rem;
  }
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[900]};
  cursor: pointer;
  flex-shrink: 0;
  position: absolute;
  left: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.blue[900]};
  }
  
  @media (max-width: 768px) {
    position: static;
    width: 44px;
    height: 44px;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 20px;
  background: white;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.blue[100]};
    border-color: ${({ theme }) => theme.colors.blue[300]};
  }
  
  @media (max-width: 768px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 8px;
  background: white;
  width: 100%;
  max-width: 400px;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.gray[900]};
  }
  
  @media (max-width: 768px) {
    max-width: none;
    flex: 1;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const CarouselSection = styled.div`
  margin-bottom: 2rem;
`;

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
`;

const CarouselButton = styled.button<{ $position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  background: transparent;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  ${({ $position }) => $position === 'left' ? 'left: 0;' : 'right: 0;'}
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-50%) scale(1.1);
  }
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const CarouselContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const CarouselTrack = styled.div<{ $currentSlide: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(-${({ $currentSlide }) => $currentSlide * 100}%);
`;

const CarouselSlide = styled.div<{ $isActive: boolean }>`
  flex: 0 0 100%;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.7)};
  transition: opacity 0.5s ease-in-out;
`;

const CarouselCard = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.blue[900]};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  box-sizing: border-box;
`;

const MatchingSlideCard = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.blue[100]};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
`;

const MatchingSlideContent = styled.div`
  flex: 1;
  text-align: center;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const MatchingSlideTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 0.75rem 0;
`;

const MatchingSlideDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 1.5rem 0;
  line-height: 1.4;
`;

const MatchingSlideButton = styled.a`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.blue[900]};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: ${({ theme }) => theme.colors.blue[700]};
  }
`;

const CarouselDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const Dot = styled.div<{ $isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $isActive }) => $isActive ? theme.colors.blue[900] : theme.colors.gray[200]};
  cursor: pointer;
  transition: background 0.3s ease;
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2fr 1fr;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

const ViewAllLink = styled.a`
  color: ${({ theme }) => theme.colors.blue[900]};
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CategorySection = styled.div``;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const CategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.blue[300]};
    box-shadow: 0 2px 8px rgba(33, 66, 171, 0.1);
  }
`;

const CategoryIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const JobSection = styled.div``;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const JobCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.blue[300]};
    box-shadow: 0 2px 8px rgba(33, 66, 171, 0.1);
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const JobTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
  flex: 1;
`;

const JobSalary = styled.span`
  background: #FFD700;
  color: ${({ theme }) => theme.colors.gray[900]};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

const JobCompany = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 0.5rem 0;
`;

const JobTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const JobTag = styled.span`
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[900]};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const PortfolioSection = styled.div``;

const PortfolioStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatCard = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.blue[900]};
  border-radius: 8px;
  color: white;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const ActionButton = styled.a`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.blue[900]};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.blue[700]};
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
`;

