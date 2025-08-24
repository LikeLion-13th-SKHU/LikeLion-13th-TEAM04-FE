import styled from "styled-components";
import { colors } from "../../styles/theme";
import { useState, useEffect } from "react";
import PageTitle from "../common/PageTitle";
import { axiosInstance } from "../../utils/apiConfig";

interface PortfolioCreateViewProps {
  testUser: any;
  onClose: () => void;
}

export default function PortfolioCreateView({ testUser, onClose }: PortfolioCreateViewProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    skills: "",
    experience: "",
    hourlyRate: "",
    content: "",
    projectUrl: "",
    thumbnailUrl: "",
    availableTime: {
      weekday: false,
      weekend: false,
      evening: false,
      flexible: false
    }
  });

  const [activeTab, setActiveTab] = useState("create");

  const handleInputChange = (field: string, value: string | any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(false);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deletingPortfolio, setDeletingPortfolio] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 관리 탭이 활성화될 때 포트폴리오 목록 가져오기
  useEffect(() => {
    if (activeTab === "manage") {
      fetchPortfolios();
    }
  }, [activeTab]);

  // 수정 모드로 전환
  const handleEdit = (portfolio: any) => {
    setEditingPortfolio(portfolio);
    setFormData({
      title: portfolio.title,
      category: portfolio.category || "",
      skills: portfolio.skills || "",
      experience: portfolio.experience || "",
      hourlyRate: portfolio.hourlyRate || "",
      content: portfolio.content,
      projectUrl: portfolio.projectUrl || "",
      thumbnailUrl: portfolio.thumbnailUrl || "",
      availableTime: portfolio.availableTime || {
        weekday: false,
        weekend: false,
        evening: false,
        flexible: false
      }
    });
    setIsEditMode(true);
    setActiveTab("create");
  };

  // 수정 모드 취소
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingPortfolio(null);
    setUpdateError(null);
    setFormData({
      title: "",
      category: "",
      skills: "",
      experience: "",
      hourlyRate: "",
      content: "",
      projectUrl: "",
      thumbnailUrl: "",
      availableTime: {
        weekday: false,
        weekend: false,
        evening: false,
        flexible: false
      }
    });
  };

  // 삭제 확인 다이얼로그 표시
  const handleDeleteClick = (portfolio: any) => {
    setDeletingPortfolio(portfolio);
    setShowDeleteConfirm(true);
    setDeleteError(null);
  };

  // 삭제 확인 다이얼로그 닫기
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingPortfolio(null);
    setDeleteError(null);
  };

  // 포트폴리오 삭제 API 호출
  const handleDelete = async () => {
    if (!deletingPortfolio?.portfolioId) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      const response = await axiosInstance.delete(`/api/portfolios/${deletingPortfolio.portfolioId}`);

      if (response.status === 200) {
        console.log('포트폴리오 삭제 성공:', response.data);
        alert('포트폴리오가 성공적으로 삭제되었습니다!');
        
        // 삭제 확인 다이얼로그 닫기
        handleCancelDelete();
        
        // 포트폴리오 목록 새로고침
        fetchPortfolios();
      }
    } catch (error: any) {
      console.error('포트폴리오 삭제 실패:', error);
      
      let errorMessage = '포트폴리오 삭제에 실패했습니다.';
      if (error.response?.status === 400) {
        errorMessage = '삭제할 수 없는 포트폴리오입니다.';
      } else if (error.response?.status === 401) {
        errorMessage = '로그인이 필요합니다.';
      } else if (error.response?.status === 403) {
        errorMessage = '권한이 없습니다.';
      } else if (error.response?.status === 404) {
        errorMessage = '포트폴리오를 찾을 수 없습니다.';
      }
      
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // 포트폴리오 수정 API 호출
  const handleUpdate = async () => {
    if (!editingPortfolio?.portfolioId) return;

    // 필수 필드 검증
    if (!formData.title || !formData.content) {
      setUpdateError('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateError(null);

      const updateData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        skills: formData.skills,
        experience: formData.experience,
        hourlyRate: formData.hourlyRate,
        availableTime: formData.availableTime,
        projectUrl: formData.projectUrl || "",
        thumbnailUrl: formData.thumbnailUrl || ""
      };

      const response = await axiosInstance.put(`/api/portfolios/${editingPortfolio.portfolioId}`, updateData);

      if (response.status === 200) {
        console.log('포트폴리오 수정 성공:', response.data);
        alert('포트폴리오가 성공적으로 수정되었습니다!');
        
        // 수정 모드 종료
        handleCancelEdit();
        
        // 포트폴리오 목록 새로고침
        fetchPortfolios();
      }
    } catch (error: any) {
      console.error('포트폴리오 수정 실패:', error);
      
      let errorMessage = '포트폴리오 수정에 실패했습니다.';
      if (error.response?.status === 400) {
        errorMessage = '입력 정보를 확인해주세요.';
      } else if (error.response?.status === 401) {
        errorMessage = '로그인이 필요합니다.';
      } else if (error.response?.status === 403) {
        errorMessage = '권한이 없습니다.';
      } else if (error.response?.status === 404) {
        errorMessage = '포트폴리오를 찾을 수 없습니다.';
      }
      
      setUpdateError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // 포트폴리오 목록 가져오기
  const fetchPortfolios = async () => {
    if (!testUser?.id) return;
    
    try {
      setIsLoadingPortfolios(true);
      setPortfolioError(null);
      
      const response = await axiosInstance.get(`/api/portfolios/member/${testUser.id}`);
      
      if (response.status === 200) {
        setPortfolios(response.data.content || []);
      }
    } catch (error: any) {
      console.error('포트폴리오 목록 가져오기 실패:', error);
      
      let errorMessage = '포트폴리오 목록을 불러오는데 실패했습니다.';
      if (error.response?.status === 401) {
        errorMessage = '로그인이 필요합니다.';
      } else if (error.response?.status === 403) {
        errorMessage = '권한이 없습니다.';
      } else if (error.response?.status === 404) {
        errorMessage = '사용자를 찾을 수 없습니다.';
      }
      
      setPortfolioError(errorMessage);
      setPortfolios([]);
    } finally {
      setIsLoadingPortfolios(false);
    }
  };

  const handleSubmit = async () => {
    // 수정 모드인 경우 수정 API 호출
    if (isEditMode) {
      await handleUpdate();
      return;
    }

    // 필수 필드 검증
    if (!formData.title || !formData.category || !formData.skills || 
        !formData.experience || !formData.hourlyRate || !formData.content) {
      setSubmitError('모든 필수 항목을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // API 요청 데이터 구성 (새 필드들 포함)
      const portfolioData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        skills: formData.skills,
        experience: formData.experience,
        hourlyRate: formData.hourlyRate,
        availableTime: formData.availableTime,
        projectUrl: formData.projectUrl || "",
        thumbnailUrl: formData.thumbnailUrl || ""
      };

      // 포트폴리오 생성 API 호출
      const response = await axiosInstance.post('/api/portfolios', portfolioData);

      if (response.status === 201 || response.status === 200) {
        console.log('포트폴리오 생성 성공:', response.data);
        alert('포트폴리오가 성공적으로 등록되었습니다!');
        
        // 폼 초기화
        setFormData({
          title: "",
          category: "",
          skills: "",
          experience: "",
          hourlyRate: "",
          content: "",
          projectUrl: "",
          thumbnailUrl: "",
          availableTime: {
            weekday: false,
            weekend: false,
            evening: false,
            flexible: false
          }
        });
        
        // 관리 탭으로 이동하고 포트폴리오 목록 새로고침
        setActiveTab("manage");
        fetchPortfolios();
      }
    } catch (error: any) {
      console.error('포트폴리오 생성 실패:', error);
      
      let errorMessage = '포트폴리오 등록에 실패했습니다.';
      if (error.response?.status === 400) {
        errorMessage = '입력 정보를 확인해주세요.';
      } else if (error.response?.status === 401) {
        errorMessage = '로그인이 필요합니다.';
      } else if (error.response?.status === 403) {
        errorMessage = '권한이 없습니다.';
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
// 나중에 계정별로 포트폴리오 등록 & 저장 로직 추가  
  return (
    <>
      <PageTitle>포트폴리오 관리</PageTitle>
      
      <TabContainer>
        <TabButton 
          $active={activeTab === "create"} 
          onClick={() => setActiveTab("create")}
        >
          새로 만들기
        </TabButton>
        <TabButton 
          $active={activeTab === "manage"} 
          onClick={() => setActiveTab("manage")}
        >
          기존 포트폴리오 관리
        </TabButton>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </TabContainer>

      {activeTab === "create" ? (
                 <PortfolioSection>
           <SectionHeader>
             <SectionTitle>
               {isEditMode ? '포트폴리오 수정' : '나의 능력을 어필해보세요'}
             </SectionTitle>
             <SectionDescription>
               {isEditMode 
                 ? '포트폴리오 정보를 수정하고 저장하세요.'
                 : '상인들이 간단한 업무를 맡길 때 참고할 수 있는 포트폴리오를 만들어보세요. 영상편집, 디자인, 번역 등 어떤 재능이든 자유롭게 표현할 수 있습니다.'
               }
             </SectionDescription>
           </SectionHeader>

          <FormContainer>
            <FormRow>
              <FormLabel>포트폴리오 제목 *</FormLabel>
              <FormInput 
                type="text" 
                placeholder="예: 영상편집 전문가, 디자인 크리에이터, 번역 도우미"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </FormRow>

                         <FormRow>
               <FormLabel>업무 분야 *</FormLabel>
               <FormSelect 
                 value={formData.category}
                 onChange={(e) => handleInputChange("category", e.target.value)}
               >
                 <option value="">업무 분야를 선택하세요</option>
                 <option value="영상/편집">영상/편집</option>
                 <option value="디자인/그래픽">디자인/그래픽</option>
                 <option value="번역/통역">번역/통역</option>
                 <option value="글쓰기/콘텐츠">글쓰기/콘텐츠</option>
                 <option value="마케팅/SNS">마케팅/SNS</option>
                 <option value="사무/행정">사무/행정</option>
                 <option value="상담/컨설팅">상담/컨설팅</option>
                 <option value="교육/강의">교육/강의</option>
                 <option value="이벤트/행사">이벤트/행사</option>
                 <option value="기타">기타</option>
               </FormSelect>
             </FormRow>

            <FormRow>
              <FormLabel>보유 기술/재능 *</FormLabel>
              <FormInput 
                type="text" 
                placeholder="예: Premiere Pro, Photoshop, 영어번역, 글쓰기"
                value={formData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
              />
            </FormRow>

                         <FormRow>
               <FormLabel>경험 수준 *</FormLabel>
               <FormSelect 
                 value={formData.experience}
                 onChange={(e) => handleInputChange("experience", e.target.value)}
               >
                 <option value="">경험 수준을 선택하세요</option>
                 <option value="초보자">초보자 (1년 미만)</option>
                 <option value="중급자">중급자 (1-3년)</option>
                 <option value="고급자">고급자 (3-5년)</option>
                 <option value="전문가">전문가 (5년 이상)</option>
               </FormSelect>
             </FormRow>

            <FormRow>
              <FormLabel>시급/건당 요금 *</FormLabel>
              <FormInput 
                type="text" 
                placeholder="예: 시급 15,000원, 건당 50,000원"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
              />
            </FormRow>

            <FormRow>
              <FormLabel>프로젝트 URL (선택사항)</FormLabel>
              <FormInput 
                type="url" 
                placeholder="https://example.com/project"
                value={formData.projectUrl}
                onChange={(e) => handleInputChange("projectUrl", e.target.value)}
              />
            </FormRow>

            <FormRow>
              <FormLabel>썸네일 URL (선택사항)</FormLabel>
              <FormInput 
                type="url" 
                placeholder="https://example.com/thumbnail.jpg"
                value={formData.thumbnailUrl}
                onChange={(e) => handleInputChange("thumbnailUrl", e.target.value)}
              />
            </FormRow>

            <FormRow>
              <FormLabel>포트폴리오 내용 *</FormLabel>
              <FormTextarea 
                placeholder="포트폴리오에 대한 자세한 설명을 작성해주세요. 어떤 업무를 잘할 수 있는지, 어떤 경험이 있는지 구체적으로 소개해주세요."
                rows={5}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
              />
            </FormRow>

            <FormRow>
              <FormLabel>작업 예시 (선택사항)</FormLabel>
              <FormTextarea 
                placeholder="이전에 작업한 내용이나 예시를 간단히 설명해주세요. 포트폴리오 링크나 이미지 설명도 좋습니다."
                rows={3}
              />
            </FormRow>

                         <FormRow>
               <FormLabel>업무 가능 시간</FormLabel>
               <TimeOptionsContainer>
                 <TimeOption>
                   <input 
                     type="checkbox" 
                     id="weekday" 
                     checked={formData.availableTime.weekday}
                     onChange={(e) => handleInputChange("availableTime", {
                       ...formData.availableTime,
                       weekday: e.target.checked
                     })}
                   />
                   <label htmlFor="weekday">평일</label>
                 </TimeOption>
                 <TimeOption>
                   <input 
                     type="checkbox" 
                     id="weekend" 
                     checked={formData.availableTime.weekend}
                     onChange={(e) => handleInputChange("availableTime", {
                       ...formData.availableTime,
                       weekend: e.target.checked
                     })}
                   />
                   <label htmlFor="weekend">주말</label>
                 </TimeOption>
                 <TimeOption>
                   <input 
                     type="checkbox" 
                     id="evening" 
                     checked={formData.availableTime.evening}
                     onChange={(e) => handleInputChange("availableTime", {
                       ...formData.availableTime,
                       evening: e.target.checked
                     })}
                   />
                   <label htmlFor="evening">저녁시간</label>
                 </TimeOption>
                 <TimeOption>
                   <input 
                     type="checkbox" 
                     id="flexible" 
                     checked={formData.availableTime.flexible}
                     onChange={(e) => handleInputChange("availableTime", {
                       ...formData.availableTime,
                       flexible: e.target.checked
                     })}
                   />
                   <label htmlFor="flexible">시간 유연</label>
                 </TimeOption>
               </TimeOptionsContainer>
             </FormRow>
          </FormContainer>

                     {(submitError || updateError || deleteError) && (
             <ErrorMessage>
               {submitError || updateError || deleteError}
             </ErrorMessage>
           )}

           <ActionButtons>
             {isEditMode && (
               <CancelButton onClick={handleCancelEdit}>
                 취소
               </CancelButton>
             )}
             <SubmitButton 
               onClick={handleSubmit} 
               disabled={isSubmitting || isUpdating}
             >
               {isSubmitting || isUpdating 
                 ? (isEditMode ? '수정 중...' : '등록 중...') 
                 : (isEditMode ? '포트폴리오 수정하기' : '포트폴리오 등록하기')
               }
             </SubmitButton>
           </ActionButtons>
        </PortfolioSection>
      ) : (
        <PortfolioSection>
          <SectionHeader>
            <SectionTitle>내 포트폴리오 관리</SectionTitle>
            <SectionDescription>
              등록된 포트폴리오를 관리하고 수정할 수 있습니다.
            </SectionDescription>
          </SectionHeader>

          {isLoadingPortfolios ? (
            <LoadingState>
              <LoadingText>포트폴리오 목록을 불러오는 중...</LoadingText>
            </LoadingState>
          ) : portfolioError ? (
            <ErrorState>
              <ErrorText>{portfolioError}</ErrorText>
              <RetryButton onClick={fetchPortfolios}>다시 시도</RetryButton>
            </ErrorState>
          ) : portfolios.length === 0 ? (
            <EmptyState>
              <EmptyText>등록된 포트폴리오가 없습니다.</EmptyText>
              <EmptyDescription>새로 만들기 탭에서 첫 번째 포트폴리오를 등록해보세요!</EmptyDescription>
            </EmptyState>
          ) : (
            <PortfolioList>
              {portfolios.map((portfolio) => (
                <PortfolioItem key={portfolio.portfolioId}>
                  <PortfolioInfo>
                    <PortfolioTitle>{portfolio.title}</PortfolioTitle>
                    <PortfolioContent>{portfolio.content}</PortfolioContent>
                    {portfolio.projectUrl && (
                      <PortfolioUrl>{portfolio.projectUrl}</PortfolioUrl>
                    )}
                    <PortfolioDate>
                      등록일: {new Date(portfolio.createdAt).toLocaleDateString('ko-KR')}
                    </PortfolioDate>
                  </PortfolioInfo>
                                     <PortfolioActions>
                     <EditButton onClick={() => handleEdit(portfolio)}>수정</EditButton>
                     <DeleteButton onClick={() => handleDeleteClick(portfolio)}>삭제</DeleteButton>
                   </PortfolioActions>
                </PortfolioItem>
              ))}
            </PortfolioList>
          )}
        </PortfolioSection>
      )}

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteConfirm && (
        <DeleteConfirmOverlay>
          <DeleteConfirmModal>
            <DeleteConfirmTitle>포트폴리오 삭제</DeleteConfirmTitle>
            <DeleteConfirmMessage>
              <strong>"{deletingPortfolio?.title}"</strong> 포트폴리오를 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </DeleteConfirmMessage>
            <DeleteConfirmActions>
              <CancelDeleteButton onClick={handleCancelDelete}>
                취소
              </CancelDeleteButton>
              <ConfirmDeleteButton onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? '삭제 중...' : '삭제'}
              </ConfirmDeleteButton>
            </DeleteConfirmActions>
          </DeleteConfirmModal>
        </DeleteConfirmOverlay>
      )}
    </>
  );
}

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${colors.gray[200]};
  padding-bottom: 1rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${props => props.$active ? colors.blue[900] : 'transparent'};
  color: ${props => props.$active ? colors.white : colors.gray[700]};
  border: 1px solid ${props => props.$active ? colors.blue[900] : colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$active ? colors.blue[700] : colors.gray[100]};
  }
`;

const CloseButton = styled.button`
  margin-left: auto;
  padding: 0.5rem 1rem;
  background-color: ${colors.gray[200]};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.gray[700]};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.gray[300]};
  }
`;

const PortfolioSection = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.black};
  margin: 0 0 0.5rem 0;
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  margin: 0;
  line-height: 1.5;
`;

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const FormRow = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.black};
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: ${colors.white};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.blue[500]};
    box-shadow: 0 0 0 3px ${colors.blue[100]};
  }

  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: ${colors.white};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.blue[500]};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: ${colors.white};
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.blue[500]};
    box-shadow: 0 0 0 3px ${colors.blue[100]};
  }

  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

const TimeOptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TimeOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: ${colors.blue[500]};
  }

  label {
    font-size: 0.875rem;
    color: ${colors.gray[700]};
    cursor: pointer;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${colors.red[100]};
  color: ${colors.red[600]};
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.red[500]};
  margin: 1rem 0;
  text-align: center;
  font-size: 0.875rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  padding: 1rem 2rem;
  background-color: ${colors.gray[200]};
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.gray[700]};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.gray[300]};
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, ${colors.blue[600]} 0%, ${colors.blue[500]} 100%);
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.white};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[600]} 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    background: linear-gradient(135deg, ${colors.gray[400]} 0%, ${colors.gray[600]} 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PortfolioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PortfolioItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background-color: ${colors.gray[50]};
  border: 1px solid ${colors.gray[200]};
  border-radius: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.blue[300]};
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }
`;

const PortfolioInfo = styled.div`
  flex: 1;
`;

const PortfolioTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.black};
  margin-bottom: 0.25rem;
`;

const PortfolioCategory = styled.div`
  font-size: 0.75rem;
  color: ${colors.blue[600]};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const PortfolioSkills = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  margin-bottom: 0.25rem;
`;

const PortfolioRate = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[700]};
  font-weight: 500;
`;

const PortfolioContent = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  margin-bottom: 0.25rem;
  line-height: 1.4;
`;

const PortfolioUrl = styled.div`
  font-size: 0.75rem;
  color: ${colors.blue[600]};
  font-weight: 500;
`;

const PortfolioDate = styled.div`
  font-size: 0.75rem;
  color: ${colors.gray[500]};
  font-weight: 400;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: ${colors.gray[600]};
`;

const LoadingText = styled.div`
  font-size: 1rem;
  color: ${colors.gray[600]};
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  text-align: center;
`;

const ErrorText = styled.div`
  font-size: 1rem;
  color: ${colors.red[600]};
  margin-bottom: 1rem;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${colors.blue[500]};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.white};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.blue[600]};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  text-align: center;
`;

const EmptyText = styled.div`
  font-size: 1.125rem;
  color: ${colors.gray[600]};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const EmptyDescription = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[500]};
`;

const PortfolioActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${colors.blue[500]};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.white};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.blue[600]};
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${colors.red[500]};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.white};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.red[600]};
  }
`;

const DeleteConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DeleteConfirmModal = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const DeleteConfirmTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.black};
  margin: 0 0 1rem 0;
  text-align: center;
`;

const DeleteConfirmMessage = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[700]};
  line-height: 1.5;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const DeleteConfirmActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const CancelDeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${colors.gray[200]};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.gray[700]};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.gray[300]};
  }
`;

const ConfirmDeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${colors.red[500]};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.white};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${colors.red[600]};
  }

  &:disabled {
    background-color: ${colors.gray[400]};
    cursor: not-allowed;
  }
`;
