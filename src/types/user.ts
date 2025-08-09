export type UserRole = "청년" | "상인";

export type User = {
  id: string;
  name: string;
  profileImageUrl?: string;
  role: UserRole;
};
