import styled from "styled-components";
import { colors } from "../../styles/theme";
import { useState } from "react";
import GradeDisplay from "../common/GradeDisplay";

interface InfoCardProps {
  userName: string;
  currentScore: number;
  currentGrade: string;
}

export default function InfoCard({ userName, currentScore, currentGrade }: InfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState("-");
  const [email, setEmail] = useState("py****@n****.com");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("저장된 데이터:", { contact, email });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContact("-");
    setEmail("py****@n****.com");
  };

  return (
    <InfoCardContainer>
      {/* 회원 정보 섹션 */}
      <InfoSection>
        <SectionHeader>
          <SectionTitle>회원정보</SectionTitle>
          {isEditing ? (
            <ButtonGroup>
              <SaveButton onClick={handleSave}>저장</SaveButton>
              <CancelButton onClick={handleCancel}>취소</CancelButton>
            </ButtonGroup>
          ) : (
            <EditButton onClick={handleEdit}>수정</EditButton>
          )}
        </SectionHeader>
        <InfoDescription>
          현재 내 회원정보입니다.
        </InfoDescription>
        <InfoContent>
          <InfoRow>
            <InfoLabel>연락처</InfoLabel>
            {isEditing ? (
              <InfoInput
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="연락처를 입력하세요"
              />
            ) : (
              <InfoValue>{contact}</InfoValue>
            )}
          </InfoRow>
          <InfoRow>
            <InfoLabel>이메일</InfoLabel>
            {isEditing ? (
              <InfoInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
              />
            ) : (
              <InfoValue>{email}</InfoValue>
            )}
          </InfoRow>
          <InfoRow>
            <InfoLabel>내 청상회 등급</InfoLabel>
            <GradeDisplay grade={currentGrade} score={currentScore} />
          </InfoRow>
        </InfoContent>
      </InfoSection>

      <Divider />

      {/* 비밀번호 섹션 */}
      <InfoSection>
        <SectionTitle>비밀번호</SectionTitle>
        <PasswordContent>
          <GoogleInfo>
            <GoogleIcon>Google</GoogleIcon>
            <GoogleText>
              <div>구글 로그인 사용중입니다.</div>
              <div>비밀번호는 구글에서 변경하실 수 있습니다.</div>
            </GoogleText>
          </GoogleInfo>
        </PasswordContent>
      </InfoSection>

      <Divider />

      {/* 해외 로그인 차단 섹션 */}
      <InfoSection>
        <SectionHeader>
          <SectionTitle>해외 로그인 차단</SectionTitle>
          <ToggleSwitch>
            <ToggleSlider />
          </ToggleSwitch>
        </SectionHeader>
        <InfoDescription>
          해외 또는 해외 아이피로 로그인을 시도할 경우 청상회 접속을 차단합니다.
        </InfoDescription>
      </InfoSection>

      <Divider />

      {/* 회원탈퇴 섹션 */}
      <InfoSection>
        <SectionHeader>
          <SectionTitle>회원탈퇴</SectionTitle>
          <WithdrawButton>탈퇴</WithdrawButton>
        </SectionHeader>
      </InfoSection>
    </InfoCardContainer>
  );
}

const InfoCardContainer = styled.div`
  background-color: ${colors.gray[100]};
  border-radius: 0.75rem;
  padding: 2rem;
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.black};
  margin: 0;
`;

const InfoDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.gray[900]};
  margin: 0 0 1rem 0;
  line-height: 1.4;
`;

const EditButton = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: ${colors.blue[100]};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.blue[900]};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.blue[300]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SaveButton = styled.button`
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

const CancelButton = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: ${colors.gray[200]};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.gray[900]};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.gray[200]};
  }
`;

const InfoContent = styled.div`
  background-color: ${colors.blue[100]};
  border-radius: 0.5rem;
  padding: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${colors.blue[300]};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${colors.black};
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: ${colors.gray[900]};
`;

const InfoInput = styled.input`
  font-size: 0.875rem;
  color: ${colors.black};
  background-color: white;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  outline: none;
  width: 200px;

  &:focus {
    border-color: ${colors.blue[900]};
    box-shadow: 0 0 0 2px ${colors.blue[100]};
  }
`;

const PasswordContent = styled.div`
  background-color: ${colors.blue[100]};
  border-radius: 0.5rem;
  padding: 1rem;
`;

const GoogleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const GoogleIcon = styled.div`
  background-color: #4285F4;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const GoogleText = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[900]};
  line-height: 1.4;

  div:first-child {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
`;

const ToggleSwitch = styled.div`
  width: 3rem;
  height: 1.5rem;
  background-color: ${colors.gray[200]};
  border-radius: 1rem;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.gray[200]};
  }
`;

const ToggleSlider = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 0.125rem;
  right: 0.125rem;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const WithdrawButton = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: ${colors.blue[100]};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.blue[900]};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.blue[300]};
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${colors.blue[300]};
  margin: 2rem 0;
`;
