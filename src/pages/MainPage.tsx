import styled from "styled-components";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow-left.svg";
import { ReactComponent as ArrowRightIcon } from "../assets/icons/arrow-right.svg";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/apiConfig";

interface JobPost {
  post_id: number;
  title: string;
  location: string;
  salary: number;
  tags: string | string[];
  createAt: string;
}

export default function MainPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [activeYouthCount, setActiveYouthCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [jobPostsLoading, setJobPostsLoading] = useState(true);

  const formatTags = (tags: any): string[] => {
    if (typeof tags === "string") {
      return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }
    if (Array.isArray(tags)) {
      return tags.map((tag) => String(tag)).filter((tag) => tag.length > 0);
    }
    return [];
  };

  const slides = [
    {
      id: 1,
      type: "matching",
      title: "청년과 상인을 연결하는 AI 매칭",
      description: "챗봇과 대화하며 최적의 매칭을 찾아보세요",
      buttonText: "챗봇으로 매칭하기",
      buttonLink: "/ai-match",
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

  // 활동중인 청년 수와 포트폴리오 수 가져오기
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // 청년 역할의 멤버 수는 모든 사용자가 볼 수 있음 (인증 토큰 불필요)
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        const youthResponse = await axiosInstance.get(
          `${apiBaseUrl}/api/members/by-role?role=YOUTH`
        );

        if (youthResponse.status === 200) {
          const youthCount = youthResponse.data.totalElements || 0;
          setActiveYouthCount(youthCount);
        }

        // 포트폴리오 개수는 모든 사용자가 볼 수 있음 (인증 토큰 불필요)
        const portfolioResponse = await axiosInstance.get(
          `${apiBaseUrl}/api/portfolios/search`
        );

        if (portfolioResponse.status === 200) {
          const portfolioCount =
            portfolioResponse.data.totalElements ||
            portfolioResponse.data.length ||
            0;
          setPortfolioCount(portfolioCount);
        }
      } catch (error) {
        // 에러 발생 시 기본값 설정
        setActiveYouthCount(0);
        setPortfolioCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]); // user 의존성 다시 추가

  // 최신 채용 공고 가져오기
  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        setJobPostsLoading(true);
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await axiosInstance.get(`${apiBaseUrl}/main/post`);

        if (response.status === 200 && response.data.success) {
          setJobPosts(response.data.data || []);
        } else {
          setJobPosts([]);
        }
      } catch (error) {
        console.error("채용 공고를 불러오는데 실패했습니다:", error);
        setJobPosts([]);
      } finally {
        setJobPostsLoading(false);
      }
    };

    fetchJobPosts();
  }, []);

  return (
    <MainContainer>
      {/* 캐러셀 섹션 */}
      <CarouselSection>
        <CarouselContainer>
          <CarouselButton onClick={prevSlide} $position="left">
            <ArrowLeftIcon />
          </CarouselButton>

          <CarouselContent>
            <CarouselTrack $currentSlide={currentSlide}>
              {slides.map((slide, index) => (
                <CarouselSlide
                  key={slide.id}
                  $isActive={index === currentSlide}
                >
                  {slide.type === "matching" ? (
                    <MatchingSlideCard>
                      <MatchingSlideContent>
                        <MatchingSlideTitle>{slide.title}</MatchingSlideTitle>
                        <MatchingSlideDescription>
                          {slide.description}
                        </MatchingSlideDescription>
                        <MatchingSlideButton to={slide.buttonLink || "/"}>
                          {slide.buttonText}
                        </MatchingSlideButton>
                      </MatchingSlideContent>
                    </MatchingSlideCard>
                  ) : (
                    <CarouselCard>{slide.content}</CarouselCard>
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
        {/* 최신 채용 공고 */}
        <JobSection>
          <SectionHeader>
            <SectionTitle>최신 채용 공고</SectionTitle>
            <ViewAllLink to="/notices">전체보기 →</ViewAllLink>
          </SectionHeader>
          <JobList>
            {jobPostsLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem 1rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
                <p
                  style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}
                >
                  채용 공고를 불러오는 중...
                </p>
              </div>
            ) : jobPosts.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem 1rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📋</div>
                <p
                  style={{ fontSize: "0.875rem", color: "#9ca3af", margin: 0 }}
                >
                  등록된 채용 공고가 없습니다
                </p>
              </div>
            ) : (
              jobPosts.slice(0, 2).map((post) => (
                <JobCard
                  key={post.post_id}
                  onClick={() => navigate(`/notices/${post.post_id}`)}
                >
                  <JobHeader>
                    <JobTitle>{post.title}</JobTitle>
                    <JobSalary>시급 {post.salary.toLocaleString()}</JobSalary>
                  </JobHeader>
                  <JobCompany>{post.location}</JobCompany>
                  <JobTags>
                    {formatTags(post.tags).map((tag, index) => (
                      <JobTag key={index}>{tag}</JobTag>
                    ))}
                  </JobTags>
                </JobCard>
              ))
            )}
          </JobList>
        </JobSection>

        {/* 청년 포트폴리오 */}
        <PortfolioSection>
          <SectionHeader>
            <SectionTitle>청년 포트폴리오</SectionTitle>
          </SectionHeader>
          <PortfolioStats>
            <PortfolioStatCard to="/portfolios">
              <StatNumber>
                {isLoading ? "..." : portfolioCount.toLocaleString()}
              </StatNumber>
              <StatLabel>등록된 포트폴리오</StatLabel>
              <ViewAllText>전체보기 →</ViewAllText>
            </PortfolioStatCard>
            <StatCard>
              <StatNumber>
                {isLoading ? "..." : activeYouthCount.toLocaleString()}
              </StatNumber>
              <StatLabel>활동중인 청년</StatLabel>
            </StatCard>
          </PortfolioStats>
        </PortfolioSection>
      </ContentSection>
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

const CarouselButton = styled.button<{ $position: "left" | "right" }>`
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
  ${({ $position }) => ($position === "left" ? "left: 0;" : "right: 0;")}
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

const MatchingSlideButton = styled(Link)`
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
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.blue[900] : theme.colors.gray[200]};
  cursor: pointer;
  transition: background 0.3s ease;
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
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

const ViewAllLink = styled(Link)`
  color: ${({ theme }) => theme.colors.blue[900]};
  text-decoration: none;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
`;

const JobSection = styled.div`
  grid-column: 1;
  display: flex;
  flex-direction: column;
  min-height: 400px;
`;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const JobCard = styled.div`
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${({ theme }) => theme.colors.blue[300]};
    box-shadow: 0 4px 12px rgba(33, 66, 171, 0.15);
    transform: translateY(-2px);
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const JobTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
  flex: 1;
  line-height: 1.4;
`;

const JobSalary = styled.span`
  background: #ffd700;
  color: ${({ theme }) => theme.colors.gray[900]};
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 1rem;
`;

const JobCompany = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin: 0 0 0.75rem 0;
  font-weight: 500;
`;

const JobTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const JobTag = styled.span`
  background: ${({ theme }) => theme.colors.blue[100]};
  color: ${({ theme }) => theme.colors.blue[700]};
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.blue[300]};
`;

const PortfolioSection = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-height: 400px;
  justify-content: flex-start;
`;

const PortfolioStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: space-between;
  height: 100%;
`;

const StatCard = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.blue[900]};
  border-radius: 12px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 12px rgba(33, 66, 171, 0.2);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(33, 66, 171, 0.3);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.white};
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
  line-height: 1.4;
`;

const PortfolioStatCard = styled(Link)`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.blue[900]};
  border-radius: 12px;
  color: white;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(33, 66, 171, 0.2);

  &:hover {
    background: ${({ theme }) => theme.colors.blue[700]};
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(33, 66, 171, 0.3);
  }
`;

const ViewAllText = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue[100]};
`;

// 미사용 스타일 제거
