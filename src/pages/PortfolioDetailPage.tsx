import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { axiosInstance } from "../utils/apiConfig";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow-left.svg";

interface Portfolio {
  portfolioId: number;
  memberId: number;
  authorNickname: string;
  title: string;
  content: string;
  projectUrl?: string;
  thumbnailUrl?: string;
  category?: string;
  skills?: string;
  experience?: string;
  hourlyRate?: string;
  availableTime?: {
    weekday?: boolean;
    weekend?: boolean;
    evening?: boolean;
    flexible?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PortfolioDetailPage() {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!portfolioId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axiosInstance.get(`/api/portfolios/${portfolioId}`);
        
        if (response.status === 200) {
          setPortfolio(response.data);
        }
      } catch (error: any) {
        
        let errorMessage = '포트폴리오를 불러오는데 실패했습니다.';
        if (error.response?.status === 404) {
          errorMessage = '포트폴리오를 찾을 수 없습니다. (404 Not Found)';
        } else if (error.response?.status === 401) {
          errorMessage = '인증이 필요합니다. (401 Unauthorized)';
        } else if (error.response?.status === 403) {
          errorMessage = '접근 권한이 없습니다. (403 Forbidden)';
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

  if (isLoading) {
    return (
      <Container>
        <LoadingState>
          <LoadingIcon>⏳</LoadingIcon>
          <LoadingText>포트폴리오를 불러오는 중...</LoadingText>
        </LoadingState>
      </Container>
    );
  }

  if (error || !portfolio) {
    return (
      <Container>
        <ErrorState>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>{error || '포트폴리오 정보를 불러올 수 없습니다.'}</ErrorText>
          <RetryButton onClick={() => window.location.reload()}>다시 시도</RetryButton>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton to="/portfolios">
          <ArrowLeftIcon />
          <span>목록으로</span>
        </BackButton>
        <Title>포트폴리오 상세</Title>
        <div style={{ width: '120px' }}></div>
      </Header>

      <Content>
        <PortfolioDetailCard>
          <PortfolioHeader>
            <PortfolioTitle>{portfolio.title}</PortfolioTitle>
            <PortfolioDate>
              {new Date(portfolio.createdAt).toLocaleDateString('ko-KR')}
            </PortfolioDate>
          </PortfolioHeader>

          <PortfolioAuthor>
            <AuthorLabel>작성자:</AuthorLabel>
            <AuthorName>{portfolio.authorNickname}</AuthorName>
          </PortfolioAuthor>

          <PortfolioContent>
            <ContentLabel>포트폴리오 내용:</ContentLabel>
            <ContentText>{portfolio.content}</ContentText>
          </PortfolioContent>

          {/* 새로운 필드들 표시 */}
          <PortfolioField>
            <FieldLabel>업무 분야:</FieldLabel>
            <FieldValue>{portfolio.category || '입력되지 않음'}</FieldValue>
          </PortfolioField>
          
          <PortfolioField>
            <FieldLabel>보유 기술:</FieldLabel>
            <FieldValue>{portfolio.skills || '입력되지 않음'}</FieldValue>
          </PortfolioField>
          
          <PortfolioField>
            <FieldLabel>경험 수준:</FieldLabel>
            <FieldValue>{portfolio.experience || '입력되지 않음'}</FieldValue>
          </PortfolioField>
          
          <PortfolioField>
            <FieldLabel>시급/요금:</FieldLabel>
            <FieldValue>{portfolio.hourlyRate || '입력되지 않음'}</FieldValue>
          </PortfolioField>
          
          <PortfolioField>
            <FieldLabel>업무 가능 시간:</FieldLabel>
            <FieldValue>
              {portfolio.availableTime ? (
                [
                  portfolio.availableTime.weekday && '평일',
                  portfolio.availableTime.weekend && '주말',
                  portfolio.availableTime.evening && '저녁시간',
                  portfolio.availableTime.flexible && '시간유연'
                ].filter(Boolean).join(', ') || '설정되지 않음'
              ) : (
                '설정되지 않음'
              )}
            </FieldValue>
          </PortfolioField>

          {portfolio.projectUrl && (
            <PortfolioUrl>
              <UrlLabel>프로젝트 링크:</UrlLabel>
              <UrlLink href={portfolio.projectUrl} target="_blank" rel="noopener noreferrer">
                {portfolio.projectUrl}
              </UrlLink>
            </PortfolioUrl>
          )}

          {portfolio.thumbnailUrl && (
            <PortfolioThumbnail>
              <ThumbnailLabel>썸네일:</ThumbnailLabel>
              <ThumbnailImage src={portfolio.thumbnailUrl} alt="포트폴리오 썸네일" />
            </PortfolioThumbnail>
          )}

          <PortfolioMeta>
            <MetaItem>
              <MetaLabel>등록일:</MetaLabel>
              <MetaValue>{new Date(portfolio.createdAt).toLocaleDateString('ko-KR')}</MetaValue>
            </MetaItem>
            {portfolio.updatedAt && portfolio.updatedAt !== portfolio.createdAt && (
              <MetaItem>
                <MetaLabel>수정일:</MetaLabel>
                <MetaValue>{new Date(portfolio.updatedAt).toLocaleDateString('ko-KR')}</MetaValue>
              </MetaItem>
            )}
          </PortfolioMeta>
        </PortfolioDetailCard>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  background: ${({ theme }) => theme.colors.white};
  min-height: 100vh;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  position: relative;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.blue[600]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
  text-align: center;
  flex: 1;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: auto;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PortfolioDetailCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PortfolioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const PortfolioTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
  flex: 1;
  line-height: 1.4;
`;

const PortfolioDate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[500]};
  white-space: nowrap;
  margin-left: 1rem;
`;

const PortfolioAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const AuthorLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 0.875rem;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue[600]};
  font-size: 0.875rem;
`;

const PortfolioContent = styled.div`
  margin-bottom: 1.5rem;
`;

const ContentLabel = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const ContentText = styled.p`
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

const PortfolioField = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FieldLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-right: 1rem;
  min-width: 80px;
  flex-shrink: 0;
`;

const FieldValue = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[900]};
  flex: 1;
  line-height: 1.4;
`;

const PortfolioUrl = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.blue[100]};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.blue[300]};
`;

const UrlLabel = styled.span`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue[700]};
  margin-bottom: 0.5rem;
`;

const UrlLink = styled.a`
  display: block;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.blue[600]};
  text-decoration: none;
  word-break: break-all;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PortfolioThumbnail = styled.div`
  margin: 1rem 0;
`;

const ThumbnailLabel = styled.span`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: 0.5rem;
`;

const ThumbnailImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const PortfolioMeta = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MetaLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-right: 1rem;
  min-width: 60px;
`;

const MetaValue = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const LoadingIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.red[600]};
  margin: 0 0 1rem 0;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.blue[600]};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blue[700]};
  }
`;
