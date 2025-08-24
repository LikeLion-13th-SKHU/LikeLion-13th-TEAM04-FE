import styled from "styled-components";
import { colors } from "../../styles/theme";
import PageTitle from "../common/PageTitle";
import { User } from "../../types/user";

interface PortfolioViewProps {
  testUser: User;
}

export default function PortfolioView({ testUser }: PortfolioViewProps) {
  return (
    <>
      <PageTitle>내 포트폴리오</PageTitle>

      {/* 포트폴리오 정보 섹션 */}
      <PortfolioSection>
        <PortfolioHeader>
          <PortfolioTitle>포트폴리오 정보</PortfolioTitle>
          <PortfolioStatus>활성화</PortfolioStatus>
        </PortfolioHeader>
        <PortfolioDescription>
          현재 등록된 포트폴리오 정보입니다.
        </PortfolioDescription>
        
        <PortfolioContent>
          <PortfolioRow>
            <PortfolioLabel>이름</PortfolioLabel>
            <PortfolioValue>{testUser.name}</PortfolioValue>
          </PortfolioRow>
          <PortfolioRow>
            <PortfolioLabel>직무</PortfolioLabel>
            <PortfolioValue>웹 개발자</PortfolioValue>
          </PortfolioRow>
          <PortfolioRow>
            <PortfolioLabel>경력</PortfolioLabel>
            <PortfolioValue>신입 (1년 미만)</PortfolioValue>
          </PortfolioRow>
          <PortfolioRow>
            <PortfolioLabel>기술 스택</PortfolioLabel>
            <PortfolioValue>React, TypeScript, Node.js</PortfolioValue>
          </PortfolioRow>
          <PortfolioRow>
            <PortfolioLabel>희망 급여</PortfolioLabel>
            <PortfolioValue>연봉 3,000만원</PortfolioValue>
          </PortfolioRow>
          <PortfolioRow>
            <PortfolioLabel>등록일</PortfolioLabel>
            <PortfolioValue>2025.08.14</PortfolioValue>
          </PortfolioRow>
        </PortfolioContent>
      </PortfolioSection>

      {/* 포트폴리오 수정 섹션 */}
      <PortfolioSection>
        <PortfolioHeader>
          <PortfolioTitle>포트폴리오 수정</PortfolioTitle>
          <PortfolioEditButton>수정하기</PortfolioEditButton>
        </PortfolioHeader>
        <PortfolioDescription>
          포트폴리오 정보를 수정하거나 새로운 포트폴리오를 등록할 수 있습니다.
        </PortfolioDescription>
      </PortfolioSection>
    </>
  );
}



const PortfolioSection = styled.div`
  margin-bottom: 2rem;
  background-color: ${colors.gray[100]};
  border-radius: 0.75rem;
  padding: 2rem;
`;

const PortfolioHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const PortfolioTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.black};
  margin: 0;
`;

const PortfolioStatus = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: ${colors.blue[100]};
  color: ${colors.blue[900]};
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const PortfolioDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.gray[900]};
  margin: 0 0 1rem 0;
  line-height: 1.4;
`;

const PortfolioContent = styled.div`
  background-color: ${colors.blue[100]};
  border-radius: 0.5rem;
  padding: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

const PortfolioRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${colors.blue[300]};

  &:last-child {
    border-bottom: none;
  }
`;

const PortfolioLabel = styled.span`
  font-size: 0.875rem;
  color: ${colors.black};
  font-weight: 500;
`;

const PortfolioValue = styled.span`
  font-size: 0.875rem;
  color: ${colors.gray[900]};
`;

const PortfolioEditButton = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: ${colors.blue[900]};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.blue[700]};
  }
`;
