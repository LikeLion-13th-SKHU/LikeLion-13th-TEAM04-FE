export type UserRole = "청년" | "상인";

export type User = {
  id: string;
  name: string;
  nickname?: string;
  email?: string;
  profileImageUrl?: string;
  role: UserRole;
  memberId?: number;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  jobCategory?: string;
  score?: number;
  grade?: string;
};
