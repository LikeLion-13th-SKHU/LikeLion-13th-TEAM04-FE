export type User = {
  id: string;
  name: string;
  profileImageUrl?: string;
  role: "상인" | "청년";
  isOnline?: boolean;
  lastSeen?: number;
};

export type ChatRoom = {
  id: string;
  participants: User[];
  lastMessage?: ChatMessageItem;
  unreadCount: number;
  createdAt: number;
  updatedAt: number;
};

export type ChatMessageItem = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  content: string;
  createdAt: number;
  isRead: boolean;
};
