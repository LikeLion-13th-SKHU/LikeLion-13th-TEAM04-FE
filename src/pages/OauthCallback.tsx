import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { colors } from "../styles/theme";
import { useAuth } from "../contexts/AuthContext";

export default function OauthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, saveUserData } = useAuth();
  
  // 상태 관리
  const [status, setStatus] = useState<'loading' | 'success' | 'role-selection' | 'error'>('loading');
  const [userData, setUserDataState] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<'MERCHANT' | 'YOUTH' | null>(null);
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setErrorMessage('인증에 실패했습니다.');
          return;
        }

        if (!code) {
          setStatus('error');
          setErrorMessage('인증 코드를 받지 못했습니다.');
          return;
        }

        const redirectUri = process.env.REACT_APP_GOOGLE_AUTH_REDIRECT_URI;
        if (!redirectUri) {
          throw new Error('Google Redirect URI가 설정되지 않았습니다.');
        }

        // 백엔드 API로 인증 코드 전송
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`${apiBaseUrl}/login/oauth2/code/google?code=${code}`);
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;
        
        setUserDataState(data);
        
        // hasRole이 true이거나 이미 저장된 역할이 있는 경우 역할 선택 건너뛰기
        const userId = data.user.id || data.user.userId || data.userId || data.id;
        const savedRole = localStorage.getItem(`user_${userId}_role`);
        
        if (data.hasRole === true || savedRole) {
          // 이미 역할이 있는 경우 바로 로그인 처리
          const roleToUse = data.role || savedRole || 'YOUTH'; // 백엔드 역할 > 저장된 역할 > 기본값 순
          login({
            accessToken: data.accessToken,
            user: data.user,
            role: roleToUse
          });
          
          setStatus('success');
          
          // 잠시 후 메인 페이지로 이동
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          // 역할이 없는 경우 역할 선택 화면 표시
          setStatus('role-selection');
        }

      } catch (error: any) {
        setStatus('error');
        setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  const handleRoleSelection = async () => {
    if (!selectedRole || !userData) return;
    
    setIsSavingRole(true);
    
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
      
      // 역할 저장 API 호출 - 스웨거 문서에 따른 올바른 엔드포인트
      const response = await axios.post(`${apiBaseUrl}/login/oauth2/role`, {
        role: selectedRole
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      
      if (response.status === 200) {
        // 역할 저장 성공 - AuthContext에 사용자 정보 저장
        login({
          accessToken: userData.accessToken,
          user: userData.user,
          role: selectedRole
        });
        
        // 선택된 역할을 사용자별로 저장
        saveUserData('role', selectedRole);
        
        setStatus('success');
        
        // 잠시 후 메인 페이지로 이동
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage('역할 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingRole(false);
    }
  };

  if (status === 'loading') {
    return (
      <Container>
        <LoadingSpinner />
        <LoadingText>로그인 중...</LoadingText>
      </Container>
    );
  }

  if (status === 'role-selection') {
    return (
      <Container>
        <RoleSelectionTitle>역할을 선택해주세요</RoleSelectionTitle>
        <RoleSelectionSubtitle>향후 서비스 이용에 필요한 역할입니다</RoleSelectionSubtitle>
        
        <RoleOptionsContainer>
          <RoleOption
            selected={selectedRole === 'MERCHANT'}
            onClick={() => setSelectedRole('MERCHANT')}
          >
            <RoleName>상인</RoleName>
            <RoleDescription>사업자, 상점 운영자</RoleDescription>
          </RoleOption>
          
          <RoleOption
            selected={selectedRole === 'YOUTH'}
            onClick={() => setSelectedRole('YOUTH')}
          >
            <RoleName>청년</RoleName>
            <RoleDescription>학생, 취업 준비생</RoleDescription>
          </RoleOption>
        </RoleOptionsContainer>
        
        <ConfirmButton
          disabled={!selectedRole || isSavingRole}
          onClick={handleRoleSelection}
        >
          {isSavingRole ? '저장 중...' : '역할 선택 완료'}
        </ConfirmButton>
      </Container>
    );
  }

  if (status === 'error') {
    return (
      <Container>
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <RetryButton onClick={() => navigate('/login')}>
          로그인 페이지로 돌아가기
        </RetryButton>
      </Container>
    );
  }

  return (
    <Container>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${colors.gray[50]};
  padding: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 3px solid ${colors.gray[200]};
  border-top: 3px solid ${colors.blue[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 1.125rem;
  color: ${colors.gray[600]};
  margin-bottom: 0.5rem;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  font-size: 1.125rem;
  color: ${colors.red[600]};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${colors.blue[500]};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.blue[600]};
  }
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  font-size: 1.125rem;
  color: ${colors.green[600]};
  margin-bottom: 0.5rem;
`;

const RedirectText = styled.div`
  font-size: 1rem;
  color: ${colors.gray[500]};
`;

const RoleSelectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.gray[700]};
  margin-bottom: 0.5rem;
  text-align: center;
`;

const RoleSelectionSubtitle = styled.p`
  font-size: 1rem;
  color: ${colors.gray[600]};
  margin-bottom: 2rem;
  text-align: center;
`;

const RoleOptionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const RoleOption = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid ${props => props.selected ? colors.blue[500] : colors.gray[200]};
  border-radius: 1rem;
  background-color: ${props => props.selected ? colors.blue[100] : colors.white};
  cursor: pointer;
  transition: all 0.2s;
  min-width: 140px;
  
  &:hover {
    border-color: ${props => props.selected ? colors.blue[500] : colors.blue[300]};
    background-color: ${props => props.selected ? colors.blue[100] : colors.white};
  }
`;

const RoleIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`;

const RoleName = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.gray[700]};
  margin-bottom: 0.5rem;
`;

const RoleDescription = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  text-align: center;
`;

const ConfirmButton = styled.button<{ disabled: boolean }>`
  padding: 0.875rem 2rem;
  background-color: ${props => props.disabled ? colors.gray[300] : colors.blue[500]};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${colors.blue[600]};
  }
  
  &:disabled {
    opacity: 0.6;
  }
`;
