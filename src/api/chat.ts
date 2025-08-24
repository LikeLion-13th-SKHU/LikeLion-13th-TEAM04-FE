import { axiosInstance } from "../utils/apiConfig";

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

export const createChatRoom = async () => {
  const res = await axiosInstance.post<CreateRoomResponse>(`/chat/rooms`, {
    type: "BOT",
  });

  return res.data;
};

export const sendAiChat = async (params: {
  roomId: number;
  userId: number;
  text: string;
}) => {
  const res = await axiosInstance.post<AiChatResponse>(`/ai/chat`, params);

  return res.data;
};
