import styled from "styled-components";
import { colors } from "../../styles/theme";
import { useState } from "react";
import PageTitle from "../common/PageTitle";

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
    description: "",
    portfolioItems: []
  });

  const [activeTab, setActiveTab] = useState("create");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log("포트폴리오 생성:", formData);
    // 나중에 API 호출 로직 추가
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
            <SectionTitle>나의 능력을 어필해보세요</SectionTitle>
            <SectionDescription>
              상인들이 간단한 업무를 맡길 때 참고할 수 있는 포트폴리오를 만들어보세요.
              영상편집, 디자인, 번역 등 어떤 재능이든 자유롭게 표현할 수 있습니다.
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
                <option value="video">영상/편집</option>
                <option value="design">디자인/그래픽</option>
                <option value="translation">번역/통역</option>
                <option value="writing">글쓰기/콘텐츠</option>
                <option value="marketing">마케팅/SNS</option>
                <option value="admin">사무/행정</option>
                <option value="consulting">상담/컨설팅</option>
                <option value="education">교육/강의</option>
                <option value="event">이벤트/행사</option>
                <option value="other">기타</option>
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
                <option value="beginner">초보자 (1년 미만)</option>
                <option value="intermediate">중급자 (1-3년)</option>
                <option value="advanced">고급자 (3-5년)</option>
                <option value="expert">전문가 (5년 이상)</option>
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
              <FormLabel>자기소개 *</FormLabel>
              <FormTextarea 
                placeholder="어떤 업무를 잘할 수 있는지, 어떤 경험이 있는지 간단히 소개해주세요. 상인들이 업무를 맡길 때 참고할 수 있도록 구체적으로 작성해주세요."
                rows={5}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
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
                  <input type="checkbox" id="weekday" />
                  <label htmlFor="weekday">평일</label>
                </TimeOption>
                <TimeOption>
                  <input type="checkbox" id="weekend" />
                  <label htmlFor="weekend">주말</label>
                </TimeOption>
                <TimeOption>
                  <input type="checkbox" id="evening" />
                  <label htmlFor="evening">저녁시간</label>
                </TimeOption>
                <TimeOption>
                  <input type="checkbox" id="flexible" />
                  <label htmlFor="flexible">시간 유연</label>
                </TimeOption>
              </TimeOptionsContainer>
            </FormRow>
          </FormContainer>

          <ActionButtons>
            <SubmitButton onClick={handleSubmit}>
              포트폴리오 등록하기
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

          <PortfolioList>
            <PortfolioItem>
              <PortfolioInfo>
                <PortfolioTitle>영상편집 전문가</PortfolioTitle>
                <PortfolioCategory>영상/편집</PortfolioCategory>
                <PortfolioSkills>Premiere Pro, After Effects, 영상편집</PortfolioSkills>
                <PortfolioRate>시급 20,000원</PortfolioRate>
              </PortfolioInfo>
              <PortfolioActions>
                <EditButton>수정</EditButton>
                <DeleteButton>삭제</DeleteButton>
              </PortfolioActions>
            </PortfolioItem>

            <PortfolioItem>
              <PortfolioInfo>
                <PortfolioTitle>디자인 크리에이터</PortfolioTitle>
                <PortfolioCategory>디자인/그래픽</PortfolioCategory>
                <PortfolioSkills>Photoshop, Illustrator, 로고디자인</PortfolioSkills>
                <PortfolioRate>건당 100,000원</PortfolioRate>
              </PortfolioInfo>
              <PortfolioActions>
                <EditButton>수정</EditButton>
                <DeleteButton>삭제</DeleteButton>
              </PortfolioActions>
            </PortfolioItem>
          </PortfolioList>
        </PortfolioSection>
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

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, ${colors.blue[600]} 0%, ${colors.blue[800]} 100%);
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.white};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover {
    background: linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[700]} 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
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
