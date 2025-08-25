import { useState, useEffect } from "react";
import styled from "styled-components";
import { colors } from "../../styles/theme";
import GradeDisplay from "../common/GradeDisplay";
import { useAuth } from "../../contexts/AuthContext";
import { axiosInstance } from "../../utils/apiConfig";

interface InfoCardProps {
  userName: string;
  userId: string;
  currentScore: number;
  currentGrade: string;
  onNicknameChange?: (newNickname: string) => void;
}

export default function InfoCard({
  userName,
  userId,
  currentScore,
  currentGrade,
  onNicknameChange,
}: InfoCardProps) {
  const { updateUserRole, updateUserNickname, user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(userName);
  const [showRoleChange, setShowRoleChange] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'available' | 'duplicate' | 'error'>('idle');

  // 전역 사용자 상태에서 닉네임 동기화
  useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname);
    } else {
      setNickname(userName);
    }
  }, [userId, user?.nickname, userName]);

  // userName이 변경될 때 nickname도 업데이트 (외부에서 nickname이 변경된 경우)
  useEffect(() => {
    setNickname(userName);
  }, [userName]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // 중복 확인이 완료되지 않은 경우 중복 확인 요청
    if (nicknameStatus === 'idle') {
      checkNicknameDuplicate(nickname);
      return;
    }

    // 중복된 닉네임인 경우 저장 불가
    if (nicknameStatus === 'duplicate') {
      alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
      return;
    }

    // 사용 가능한 닉네임인 경우에만 저장
    if (nicknameStatus === 'available') {
      setIsEditing(false);
      // 전역 상태에 닉네임 저장
      updateUserNickname(nickname);

      if (onNicknameChange && nickname !== userName) {
        onNicknameChange(nickname);
      }
      
      setNicknameStatus('idle');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // 전역 사용자 닉네임으로 되돌리기
    setNickname(user?.nickname || userName);
    setNicknameStatus('idle');
  };

  // 닉네임 중복 확인 함수
  const checkNicknameDuplicate = async (nicknameToCheck: string) => {
    if (!nicknameToCheck.trim()) {
      setNicknameStatus('error');
      return;
    }

    // 현재 닉네임과 동일한 경우 중복 확인 불필요
    if (nicknameToCheck === (user?.nickname || userName)) {
      setNicknameStatus('available');
      return;
    }

    setIsCheckingNickname(true);
    setNicknameStatus('idle');

    try {
      const response = await axiosInstance.get(`/api/members/check/nickname?nickname=${encodeURIComponent(nicknameToCheck)}`);
      
      if (response.status === 200) {
        const data = response.data;
        if (data.available) {
          setNicknameStatus('available');
        } else {
          setNicknameStatus('duplicate');
        }
      } else {
        setNicknameStatus('error');
      }
    } catch (error) {
      setNicknameStatus('error');
    } finally {
      setIsCheckingNickname(false);
    }
  };

  // 닉네임 입력 변경 시 중복 확인 상태 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setNicknameStatus('idle');
  };

  const handleRoleChange = async (newRole: "청년" | "상인") => {
    try {
      // 역할 변경
      await updateUserRole(newRole === "청년" ? "YOUTH" : "MERCHANT");
      setShowRoleChange(false);

      // 성공 메시지 표시
      alert(`${newRole}으로 역할이 변경되었습니다.`);
    } catch (error) {
      alert("역할 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleWithdraw = async () => {
    if (
      !window.confirm(
        "정말로 회원탈퇴를 하시겠습니까?\n\n탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다."
      )
    ) {
      return;
    }

    setIsWithdrawing(true);

    try {
      // 백엔드 API 호출하여 회원탈퇴 처리
      const response = await axiosInstance.delete("/api/members/me");

      if (response.status === 200) {
        // 회원탈퇴 성공
        alert("회원탈퇴가 완료되었습니다.");

        // 로그아웃 처리
        logout();

        // 강제로 페이지 새로고침하여 모든 상태 초기화
        window.location.reload();
      } else {
        throw new Error("회원탈퇴 처리에 실패했습니다.");
      }
    } catch (error: any) {
      alert("회원탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsWithdrawing(false);
    }
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
        <InfoDescription>현재 내 회원정보입니다.</InfoDescription>
        <InfoContent>
          <InfoRow>
            <InfoLabel>닉네임</InfoLabel>
            {isEditing ? (
              <NicknameEditContainer>
                <InfoInput
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="닉네임을 입력하세요"
                  hasError={nicknameStatus === 'duplicate'}
                />
                <NicknameCheckButton 
                  onClick={() => checkNicknameDuplicate(nickname)}
                  disabled={isCheckingNickname || !nickname.trim()}
                >
                  {isCheckingNickname ? '확인 중...' : '중복 확인'}
                </NicknameCheckButton>
                {nicknameStatus === 'available' && (
                  <NicknameStatus available>✓ 사용 가능한 닉네임입니다</NicknameStatus>
                )}
                {nicknameStatus === 'duplicate' && (
                  <NicknameStatus available={false}>✗ 이미 사용 중인 닉네임입니다</NicknameStatus>
                )}
                {nicknameStatus === 'error' && (
                  <NicknameStatus available={false}>✗ 오류가 발생했습니다</NicknameStatus>
                )}
              </NicknameEditContainer>
            ) : (
              <InfoValue>{nickname}</InfoValue>
            )}
          </InfoRow>
          <InfoRow>
            <InfoLabel>역할</InfoLabel>
            <RoleChangeContainer>
              <InfoValue>{user?.role || "청년"}</InfoValue>
              <RoleChangeButton
                onClick={() => setShowRoleChange(!showRoleChange)}
              >
                역할 변경
              </RoleChangeButton>
              {showRoleChange && (
                <RoleButtonGroup>
                  <RoleButton
                    isActive={user?.role === "청년"}
                    onClick={() => handleRoleChange("청년")}
                  >
                    청년
                  </RoleButton>
                  <RoleButton
                    isActive={user?.role === "상인"}
                    onClick={() => handleRoleChange("상인")}
                  >
                    상인
                  </RoleButton>
                </RoleButtonGroup>
              )}
            </RoleChangeContainer>
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



      {/* 회원탈퇴 섹션 */}
      <InfoSection>
        <SectionHeader>
          <SectionTitle>회원탈퇴</SectionTitle>
          <WithdrawButton onClick={handleWithdraw} disabled={isWithdrawing}>
            {isWithdrawing ? "처리 중..." : "탈퇴"}
          </WithdrawButton>
        </SectionHeader>
        <InfoDescription>
          회원탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
        </InfoDescription>
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
  margin-bottom: 0.5rem;
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
  background-color: ${colors.blue[500]};
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.blue[600]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SaveButton = styled.button`
  background-color: ${colors.blue[500]};
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.blue[600]};
  }
`;

const CancelButton = styled.button`
  background-color: ${colors.gray[500]};
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.gray[600]};
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
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${colors.blue[300]};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.div`
  width: 120px;
  font-weight: 600;
  color: ${colors.gray[700]};
  flex-shrink: 0;
`;

const InfoValue = styled.div`
  flex: 1;
  color: ${colors.gray[900]};
`;

const InfoInput = styled.input<{ hasError?: boolean }>`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${props => props.hasError ? colors.red[500] : colors.gray[300]};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? colors.red[500] : colors.blue[500]};
    box-shadow: 0 0 0 3px ${props => props.hasError ? colors.red[100] : colors.blue[100]};
  }
`;

const RoleChangeContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const RoleButtonGroup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid ${colors.gray[300]};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 120px;
  display: flex;
  flex-direction: column;
`;

const RoleButton = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: ${(props) => (props.isActive ? colors.blue[500] : "white")};
  color: ${(props) => (props.isActive ? "white" : colors.gray[700])};
  border: 1px solid
    ${(props) => (props.isActive ? colors.blue[500] : colors.gray[300])};
  font-weight: ${(props) => (props.isActive ? "600" : "400")};
  position: relative;
  min-width: 80px;

  &:hover {
    background-color: ${(props) =>
      props.isActive ? colors.blue[600] : colors.blue[100]};
    border-color: ${(props) =>
      props.isActive ? colors.blue[600] : colors.blue[300]};
    color: ${(props) => (props.isActive ? "white" : colors.blue[700])};
    transform: ${(props) => (props.isActive ? "none" : "translateY(-1px)")};
    box-shadow: ${(props) =>
      props.isActive ? "none" : "0 2px 8px rgba(0, 0, 0, 0.1)"};
  }

  &:active {
    transform: ${(props) => (props.isActive ? "none" : "translateY(0)")};
    box-shadow: ${(props) =>
      props.isActive ? "none" : "0 1px 4px rgba(0, 0, 0, 0.1)"};
  }

  &:first-child {
    border-radius: 0.5rem 0.5rem 0 0;
    border-bottom: ${(props) =>
      props.isActive
        ? `1px solid ${colors.blue[500]}`
        : `1px solid ${colors.gray[300]}`};
  }

  &:last-child {
    border-radius: 0 0 0.5rem 0.5rem;
    border-top: ${(props) =>
      props.isActive
        ? `1px solid ${colors.blue[500]}`
        : `1px solid ${colors.gray[300]}`};
  }

  ${(props) =>
    props.isActive &&
    `
    &::after {
      content: '✓';
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
      color: white;
      transition: all 0.3s ease;
    }
  `}
`;

const RoleChangeButton = styled.button`
  background-color: ${colors.blue[500]};
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.blue[600]};
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
  background-color: #4285f4;
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



const WithdrawButton = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: ${colors.red[500]};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${colors.red[600]};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: ${colors.gray[300]};
    color: ${colors.gray[500]};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${colors.blue[300]};
  margin: 2rem 0;
`;

const NicknameEditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const NicknameCheckButton = styled.button`
  background-color: ${colors.blue[500]};
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background-color: ${colors.blue[600]};
  }

  &:disabled {
    background-color: ${colors.gray[300]};
    color: ${colors.gray[500]};
    cursor: not-allowed;
  }
`;

const NicknameStatus = styled.div<{ available: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.available ? colors.green[600] : colors.red[600]};
  font-weight: 500;
`;
