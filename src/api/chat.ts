import { axiosInstance } from "../utils/apiConfig";

export interface CreateChatRoomResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    roomId: number;
  };
}

export interface CreateChatRoomPayload {
  type: "DIRECT";
  otherUserId: number; // 채팅할 상대방의 userId
  roomName: string; // 채팅방 이름
  postId: number; // 공고글 ID
}

// 채팅방 목록조회 응답 타입
export interface ChatRoomListResponse {
  success: boolean;
  code: string;
  message: string;
  data: ChatRoomItem[];
}

export interface ChatRoomItem {
  id: number;
  name: string;
  creatorId: number;
  participantId: number;
  postId: number;
  createdAt: string;
}

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<ChatRoomListResponse> => {
  try {
    const response = await axiosInstance.get<ChatRoomListResponse>('/chat/rooms');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// 사용자 간 직접 채팅방 생성
export const createUserChatRoom = async (payload: CreateChatRoomPayload): Promise<CreateChatRoomResponse> => {
  try {
    const response = await axiosInstance.post<CreateChatRoomResponse>('/chat/rooms', payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// AI 채팅방 생성 (기존 호환성 유지)
export const createChatRoom = async () => {
  const res = await axiosInstance.post<CreateChatRoomResponse>(`/chat/rooms`, {
    type: "BOT",
  });

  return res.data;
};

export type CreateRoomResponse = {
  success: boolean;
  code: string;
  message: string;
  data: { roomId: number };
};

export type AiChatResponse = {
  success: boolean;
  code: string;
  message: string;
  data: {
    reply: string;
    results: any[];
  };
};

export const sendAiChat = async (params: {
  roomId: number;
  userId: number;
  text: string;
}) => {
  const res = await axiosInstance.post<AiChatResponse>(`/ai/chat`, params);

  return res.data;
};

