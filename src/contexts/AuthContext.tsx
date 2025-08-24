  import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User } from "../types/user";
import { axiosInstance } from "../utils/apiConfig";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: { accessToken: string; user: any; role: string }) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  updateUserNickname: (newNickname: string) => void;
  updateUserRole: (newRole: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = useMemo(
    () => !!localStorage.getItem("accessToken") && !!user,
    [user]
  );

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const syncProfile = async () => {
        try {
          const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
          const res = await axiosInstance.get(`${apiBaseUrl}/api/members/me`);
          if (res.status !== 200) {
            // API 호출 실패 시 토큰 제거
            localStorage.removeItem("accessToken");
            setUser(null);
            return;
          }
          const data = res.data;
          const mapped: User = {
            id: String(data.id ?? data.userId ?? data.memberId ?? "unknown"),
            name: data.nickname || data.name || data.email || "사용자",
            nickname: data.nickname || undefined,
            email: data.email || undefined,
            profileImageUrl:
              data.profileImageUrl || data.avatarUrl || undefined,
            role:
              data.role === "MERCHANT" || data.role === "상인"
                ? "상인"
                : "청년",
            memberId:
              typeof data.memberId === "number" ? data.memberId : undefined,
            phoneNumber: data.phoneNumber || undefined,
            address: data.address || undefined,
            bio: data.bio || undefined,
            jobCategory: data.jobCategory || undefined,
            score: data.score || 0,
            grade: data.grade || "브론즈",
          };
          setUser(mapped);
        } catch (error) {
          // 에러 발생 시 토큰 제거
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      };
      syncProfile();
    }
  }, []);

  const login = useCallback(
    (userData: { accessToken: string; user: any; role: string }) => {
      const u = userData.user || {};
      const userInfo: User = {
        id: String(u.id ?? u.userId ?? u.memberId ?? "unknown"),
        name: u.nickname || u.name || u.email || "사용자",
        nickname: u.nickname || undefined,
        email: u.email || undefined,
        profileImageUrl: u.profileImageUrl || undefined,
        role:
          (u.role || userData.role) === "MERCHANT" ||
          (u.role || userData.role) === "상인"
            ? "상인"
            : "청년",
        memberId: typeof u.memberId === "number" ? u.memberId : undefined,
        phoneNumber: u.phoneNumber || undefined,
        address: u.address || undefined,
        bio: u.bio || undefined,
        jobCategory: u.jobCategory || undefined,
        score: u.score || 0,
        grade: u.grade || "브론즈",
      };

      setUser(userInfo);

      localStorage.setItem("accessToken", userData.accessToken);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");

    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const updateUserNickname = useCallback(
    (newNickname: string) => {
      if (!user) return;

      const updatedUser = { ...user, nickname: newNickname };
      setUser(updatedUser);

      // 사용자 정보는 전역 상태로만 유지
    },
    [user]
  );

  const updateUserRole = useCallback(
    async (newRole: string) => {
      if (!user) return;

      try {
        // 백엔드 API 호출하여 역할 변경
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await axiosInstance.post(
          `${apiBaseUrl}/login/oauth2/role`,
          {
            role: newRole,
          }
        );

        if (response.status === 200) {
          // newRole을 UserRole 타입으로 변환
          const userRole: "청년" | "상인" =
            newRole === "MERCHANT" || newRole === "상인" ? "상인" : "청년";

          const updatedUser = { ...user, role: userRole };
          setUser(updatedUser);

          // 사용자 정보는 전역 상태로만 유지
        } else {
          throw new Error("역할 업데이트에 실패했습니다.");
        }
      } catch (error) {
        throw error;
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      updateUser,
      updateUserNickname,
      updateUserRole,
    }),
    [
      user,
      isAuthenticated,
      login,
      logout,
      updateUser,
      updateUserNickname,
      updateUserRole,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
