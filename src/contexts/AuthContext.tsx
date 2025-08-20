import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { User } from "../types/user";

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (userData: { accessToken: string; user: any; role: string }) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  updateUserNickname: (newNickname: string) => void;
  updateUserRole: (newRole: string) => void;
  saveUserData: (key: string, value: any) => void;
  getUserData: (key: string) => any;
  clearUserData: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

  // 사용자별 데이터 키 생성 함수
  const getUserDataKey = (key: string) => {
    if (!user?.id) return null;
    return `user_${user.id}_${key}`;
  };

  // 사용자 데이터 저장 함수
  const saveUserData = (key: string, value: any) => {
    const dataKey = getUserDataKey(key);
    if (dataKey) {
      try {
        // 문자열인 경우 JSON.stringify 사용하지 않음
        const dataToSave = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(dataKey, dataToSave);
      } catch (error) {
        // 에러 처리만 유지
      }
    }
  };

  // 사용자 데이터 불러오기 함수
  const getUserData = (key: string) => {
    const dataKey = getUserDataKey(key);
    if (dataKey) {
      try {
        const savedData = localStorage.getItem(dataKey);
        if (!savedData) return null;
        
        // 문자열인 경우 JSON.parse 사용하지 않음
        // JSON.parse를 시도하고 실패하면 원본 문자열 반환
        try {
          return JSON.parse(savedData);
        } catch {
          return savedData;
        }
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  // 사용자별 데이터 정리 함수
  const clearUserData = () => {
    if (!user?.id) return;
    
    // 사용자별로 저장된 모든 데이터 키 찾기
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`user_${user.id}_`)) {
        keysToRemove.push(key);
      }
    }
    
    // 찾은 키들 삭제
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  };

  // 컴포넌트 마운트 시 localStorage에서 기존 사용자 정보 불러오기
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUserInfo = localStorage.getItem('userInfo');
    
    if (savedToken && savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo);
        
        // 저장된 사용자 정보에 닉네임, 역할이 있는지 확인하고 불러오기
        if (userInfo.id) {
          const savedNickname = localStorage.getItem(`user_${userInfo.id}_nickname`);
          const savedRole = localStorage.getItem(`user_${userInfo.id}_role`);
          
          if (savedNickname) {
            // JSON.parse 없이 직접 사용 (이미 문자열)
            userInfo.nickname = savedNickname;
          }
          if (savedRole) {
            // 저장된 역할이 있으면 그것을 사용
            userInfo.role = savedRole === 'MERCHANT' ? '상인' : '청년';
          }
        }
        
        setUser(userInfo);
        setAccessToken(savedToken);
      } catch (error) {
        // 파싱 실패 시 localStorage 정리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
      }
    }
  }, []);

  const login = (userData: { accessToken: string; user: any; role: string }) => {
    const userId = userData.user.id || userData.user.userId || 'unknown';
    
    // 기존에 저장된 사용자별 데이터가 있는지 확인
    const savedNickname = localStorage.getItem(`user_${userId}_nickname`);
    const savedRole = localStorage.getItem(`user_${userId}_role`);
    
    // 저장된 역할이 있으면 그것을 사용, 없으면 새로 받은 역할 사용
    const finalRole = savedRole || userData.role;
    
    const userInfo: User = {
      id: userId,
      name: userData.user.name || userData.user.email || '사용자',
      nickname: savedNickname || userData.user.name || userData.user.email || '사용자',
      profileImageUrl: userData.user.profileImageUrl,
      role: finalRole === 'MERCHANT' ? '상인' : '청년'
    };
    
    setUser(userInfo);
    setAccessToken(userData.accessToken);
    
    // localStorage에 저장
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // 역할 정보도 사용자별로 저장 (새로운 역할인 경우에만)
    if (!savedRole) {
      saveUserData('role', finalRole);
    }
    
  };

  const logout = () => {
    // 인증 관련 데이터만 삭제 (accessToken, userInfo)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    
    // 사용자별 데이터는 유지 (닉네임, 연락처 등)
    // 이는 다른 계정으로 로그인할 때도 데이터가 섞이지 않도록 하기 위함
    
    setUser(null);
    setAccessToken(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
  };

  const updateUserNickname = (newNickname: string) => {
    if (!user) return;
    
    const updatedUser = { ...user, nickname: newNickname };
    setUser(updatedUser);
    
    // localStorage에 저장
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    saveUserData('nickname', newNickname);
    
  };

  const updateUserRole = async (newRole: string) => {
    if (!user) return;

    try {
      // 백엔드 API 호출하여 역할 변경
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/login/oauth2/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        // newRole을 UserRole 타입으로 변환
        const userRole: "청년" | "상인" = newRole === 'MERCHANT' || newRole === '상인' ? '상인' : '청년';
        
        const updatedUser = { ...user, role: userRole };
        setUser(updatedUser);
        
        // localStorage에 저장
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        saveUserData('role', newRole);
      } else {
        throw new Error('역할 업데이트에 실패했습니다.');
      }
    } catch (error) {
      throw error;
    }
  };

  const value = useMemo(() => ({ 
    user, 
    accessToken, 
    isAuthenticated, 
    login, 
    logout,
    updateUser,
    updateUserNickname,
    updateUserRole,
    saveUserData,
    getUserData,
    clearUserData
  }), [user, accessToken, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
