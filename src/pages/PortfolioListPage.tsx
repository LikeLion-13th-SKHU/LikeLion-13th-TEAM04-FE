import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { axiosInstance } from "../utils/apiConfig";
import { Link } from "react-router-dom";
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

export default function PortfolioListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);


  // 검색 함수
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    
    if (!searchValue.trim()) {
      setFilteredPortfolios(portfolios);
      return;
    }
    
    const filtered = portfolios.filter(portfolio => 
      portfolio.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      portfolio.content.toLowerCase().includes(searchValue.toLowerCase()) ||
      (portfolio.authorNickname && portfolio.authorNickname.toLowerCase().includes(searchValue.toLowerCase())) ||
      (portfolio.category && portfolio.category.toLowerCase().includes(searchValue.toLowerCase())) ||
      (portfolio.skills && portfolio.skills.toLowerCase().includes(searchValue.toLowerCase()))
    );
    
    setFilteredPortfolios(filtered);
  };

  // 포트폴리오 데이터 가져오기
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axiosInstance.get('/api/portfolios/search');
        
        if (response.status === 200) {
          const portfolioData = response.data.content || response.data || [];
          
          setPortfolios(portfolioData);
          setFilteredPortfolios(portfolioData); // 초기 필터링된 목록 설정
        }
        
        setIsLoading(false);
      } catch (error: any) {
        // 에러 메시지 설정
        let errorMessage = '포트폴리오를 불러오는데 실패했습니다.';
        if (error.response?.status === 405) {
          errorMessage = 'API 메서드가 지원되지 않습니다. (405 Method Not Allowed)';
        } else if (error.response?.status === 404) {
          errorMessage = 'API 엔드포인트를 찾을 수 없습니다. (404 Not Found)';
        } else if (error.response?.status === 401) {
          errorMessage = '인증이 필요합니다. (401 Unauthorized)';
        }
        
        setError(errorMessage);
        setPortfolios([]);
        setFilteredPortfolios([]);
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);



  return (
    <Container>
      <Header>
        <BackButton to="/">
          <ArrowLeftIcon />
          <span>뒤로가기</span>
        </BackButton>
        <Title>포트폴리오</Title>
        <div style={{ width: '120px' }}></div> {/* 뒤로가기 버튼과 동일한 너비 */}
      </Header>



      <Content>
        {/* 검색 입력창 */}
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="포트폴리오 제목, 내용, 작성자, 업무분야, 기술 등을 검색해보세요..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <SearchIcon>🔍</SearchIcon>
        </SearchContainer>

        {/* 검색 결과 개수 표시 */}
        {!isLoading && !error && (
          <SearchResultInfo>
            {searchTerm ? (
              <>
                <strong>"{searchTerm}"</strong> 검색 결과: <strong>{filteredPortfolios.length}개</strong>
                {filteredPortfolios.length !== portfolios.length && (
                  <span> (전체 {portfolios.length}개 중)</span>
                )}
              </>
            ) : (
              `전체 포트폴리오: ${portfolios.length}개`
            )}
          </SearchResultInfo>
        )}

        {isLoading ? (
          <LoadingMessage>포트폴리오를 불러오는 중...</LoadingMessage>
        ) : error ? (
          <ErrorState>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorText>{error}</ErrorText>
            <RetryButton onClick={() => window.location.reload()}>다시 시도</RetryButton>
          </ErrorState>
        ) : filteredPortfolios.length === 0 ? (
          searchTerm ? (
            <EmptyMessage>검색 결과가 없습니다. 다른 검색어를 시도해보세요.</EmptyMessage>
          ) : (
            <EmptyMessage>등록된 포트폴리오가 없습니다.</EmptyMessage>
          )
        ) : (
          <PortfolioGrid>
            {filteredPortfolios.map((portfolio) => (
                             <PortfolioCard 
                               key={portfolio.portfolioId}
                               onClick={() => navigate(`/portfolios/${portfolio.portfolioId}`)}
                             >
                 <PortfolioHeader>
                   <PortfolioTitle>{portfolio.title}</PortfolioTitle>
                   <PortfolioDate>
                     {new Date(portfolio.createdAt).toLocaleDateString('ko-KR')}
                   </PortfolioDate>
                 </PortfolioHeader>
                 <PortfolioDescription>{portfolio.content}</PortfolioDescription>
                 <PortfolioAuthor>
                   <AuthorName>청년: {portfolio.authorNickname}</AuthorName>
                 </PortfolioAuthor>
                 
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

               </PortfolioCard>
            ))}
          </PortfolioGrid>
        )}
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
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 12px;
  font-size: 1rem;
  background-color: white;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.gray[400]};
  pointer-events: none;
`;

const SearchResultInfo = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};

  strong {
    color: ${({ theme }) => theme.colors.blue[600]};
    font-weight: 600;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: 1.125rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: 1.125rem;
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PortfolioCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.blue[300]};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const PortfolioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PortfolioTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
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

const PortfolioDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PortfolioAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: 0.875rem;
`;

const PortfolioUrl = styled.div`
  margin: 0.75rem 0;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.blue[100]};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.blue[300]};
`;

const UrlLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue[700]};
  margin-bottom: 0.25rem;
`;

const UrlLink = styled.a`
  display: block;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.blue[600]};
  text-decoration: none;
  word-break: break-all;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PortfolioThumbnail = styled.div`
  margin: 0.75rem 0;
`;

const ThumbnailLabel = styled.span`
  display: block;
  font-size: 0.75rem;
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

const PortfolioField = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FieldLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-right: 0.5rem;
  min-width: 60px;
  flex-shrink: 0;
`;

const FieldValue = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray[900]};
  flex: 1;
  line-height: 1.4;
`;

const PortfolioMeta = styled.div`
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const MetaLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-right: 0.5rem;
  min-width: 50px;
`;

const MetaValue = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray[700]};
`;



const ViewButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.blue[600]};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.blue[700]};
  }
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
