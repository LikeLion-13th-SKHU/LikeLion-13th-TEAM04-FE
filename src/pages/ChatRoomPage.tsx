import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { colors } from "../styles/theme";
import type { ChatMessageItem, User } from "../types/userChat";
import { useAuth } from "../contexts/AuthContext";

export default function ChatRoomPage() {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 임시 상대방 정보 (실제로는 채팅방 ID를 통해 가져와야 함)
  const otherUser: User = {
    id: "user2",
    name: "박청년",
    role: "청년",
    profileImageUrl: "https://via.placeholder.com/40",
    isOnline: true
  };

  // 임시 메시지 데이터
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const sampleMessages: ChatMessageItem[] = [
      {
        id: "1",
        senderId: "user2",
        senderName: "박청년",
        senderAvatarUrl: otherUser.profileImageUrl,
        content: "안녕하세요! 지원서 제출했습니다.",
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
        isRead: true
      },
      {
        id: "2",
        senderId: user.id,
        senderName: user.name,
        senderAvatarUrl: user.profileImageUrl,
        content: "안녕하세요! 지원서 잘 봤습니다.",
        createdAt: Date.now() - 1000 * 60 * 60,
        isRead: true
      },
      {
        id: "3",
        senderId: "user2",
        senderName: "박청년",
        senderAvatarUrl: otherUser.profileImageUrl,
        content: "감사합니다! 혹시 추가로 필요한 서류가 있나요?",
        createdAt: Date.now() - 1000 * 60 * 30,
        isRead: true
      }
    ];
    setMessages(sampleMessages);
  }, [user?.profileImageUrl, otherUser.profileImageUrl, user?.id, user?.name, isAuthenticated]);

  // 메시지 전송
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user) return;

    const newMessage: ChatMessageItem = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderAvatarUrl: user.profileImageUrl,
      content: inputMessage.trim(),
      createdAt: Date.now(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
  };

  // 엔터키로 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim() && user) {
        const newMessage: ChatMessageItem = {
          id: Date.now().toString(),
          senderId: user.id,
          senderName: user.name,
          senderAvatarUrl: user.profileImageUrl,
          content: inputMessage.trim(),
          createdAt: Date.now(),
          isRead: false
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage("");
      }
    }
  };

  // 스크롤을 맨 아래로
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAuthenticated, user]);
  
  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  return (
    <PageContainer>
      <ChatHeader>
        <BackButton onClick={() => navigate("/chat")}>
          ←
        </BackButton>
        <UserInfo>
          <UserAvatar src={otherUser.profileImageUrl} alt={otherUser.name} />
          <div>
            <UserName>{otherUser.name}</UserName>
            <UserStatus $isOnline={otherUser.isOnline || false}>
              {otherUser.isOnline ? "온라인" : "오프라인"}
            </UserStatus>
          </div>
        </UserInfo>
      </ChatHeader>

      <ChatContainer>
        <MessagesContainer>
          {messages.map((message) => (
            <MessageBubble key={message.id} $isMine={message.senderId === user.id}>
              {message.senderId !== user.id && (
                <MessageAvatar src={message.senderAvatarUrl} alt={message.senderName} />
              )}
              <MessageContent $isMine={message.senderId === user.id}>
                <MessageText>{message.content}</MessageText>
                <MessageTime>{formatTime(message.createdAt)}</MessageTime>
              </MessageContent>
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
      </ChatContainer>

      <InputContainer>
        <MessageForm onSubmit={handleSendMessage}>
                     <MessageInput
             value={inputMessage}
             onChange={(e) => setInputMessage(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="메시지를 입력하세요..."
             rows={1}
           />
          <SendButton type="submit" disabled={!inputMessage.trim()}>
            전송
          </SendButton>
        </MessageForm>
      </InputContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 3.75rem);
  background-color: ${colors.white};
  max-width: 768px;
  margin: 0 auto;
  width: 100%;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.gray[200]};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${colors.gray[900]};
  font-size: 0.9375rem;
`;

const UserStatus = styled.div<{ $isOnline: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$isOnline ? '#10B981' : colors.gray[500]};
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background: ${props => props.$isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)'};
  border-radius: 1rem;
  border: 1px solid ${props => props.$isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)'};
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: hidden;
  background-color: ${colors.gray[50]};
  min-height: 0;
`;

const MessagesContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
`;

const MessageBubble = styled.div<{ $isMine: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  justify-content: ${props => props.$isMine ? "flex-end" : "flex-start"};
  margin-bottom: 0.5rem;
`;

const MessageAvatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin-top: 0.25rem;

  &:hover {
    transform: scale(1.05);
  }
`;

const MessageContent = styled.div<{ $isMine: boolean }>`
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isMine ? "flex-end" : "flex-start"};
  justify-content: flex-start;
`;

const MessageText = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 1.25rem;
  background-color: ${colors.white};
  color: ${colors.gray[900]};
  font-size: 0.875rem;
  line-height: 1.4;
  word-wrap: break-word;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${colors.gray[500]};
  margin-top: 0.25rem;
`;

const InputContainer = styled.div`
  padding: 1.25rem 1.5rem;
  border-top: 1px solid ${colors.gray[200]};
  background-color: ${colors.white};
  margin-top: auto;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
`;

const MessageForm = styled.form`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 0.875rem 1.25rem;
  border: 2px solid ${colors.gray[300]};
  border-radius: 2rem;
  resize: none;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.4;
  outline: none;
  transition: all 0.3s ease;
  background-color: ${colors.white};

  &:focus {
    border-color: ${colors.blue[500]};
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

const SendButton = styled.button`
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: ${colors.white};
  border: none;
  border-radius: 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;
