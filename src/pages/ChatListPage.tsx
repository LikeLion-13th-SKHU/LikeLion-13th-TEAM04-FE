import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { colors } from "../styles/theme";
import type { ChatRoom, User } from "../types/userChat";
import { useAuth } from "../contexts/AuthContext";

export default function ChatListPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // 임시 채팅방 데이터 (실제로는 API를 통해 가져와야 함)
  const [chatRooms] = useState<ChatRoom[]>(() => {
    if (!isAuthenticated || !user) return [];
    
    return [
      {
        id: "1",
        participants: [
          { id: user.id, name: user.name, role: user.role, profileImageUrl: user.profileImageUrl, isOnline: true },
          { id: "user2", name: "박청년", role: "청년", profileImageUrl: "https://via.placeholder.com/40", isOnline: false }
        ],
        lastMessage: {
          id: "msg1",
          senderId: user.id,
          senderName: user.name,
          content: "안녕하세요! 지원서 잘 봤습니다.",
          createdAt: Date.now() - 1000 * 60 * 30, // 30분 전
          isRead: false
        },
        unreadCount: 2,
        createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1일 전
        updatedAt: Date.now() - 1000 * 60 * 30
      },
      {
        id: "2",
        participants: [
          { id: user.id, name: user.name, role: user.role, profileImageUrl: user.profileImageUrl, isOnline: true },
          { id: "user3", name: "이청년", role: "청년", profileImageUrl: "https://via.placeholder.com/40", isOnline: true }
        ],
        lastMessage: {
          id: "msg2",
          senderId: "user3",
          senderName: "이청년",
          content: "네, 면접 일정 조율 가능합니다.",
          createdAt: Date.now() - 1000 * 60 * 5, // 5분 전
          isRead: true
        },
        unreadCount: 0,
        createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2시간 전
        updatedAt: Date.now() - 1000 * 60 * 5
      }
    ];
  });
  
  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const handleChatRoomClick = (chatRoomId: string) => {
    navigate(`/chat/${chatRoomId}`);
  };

  const getOtherParticipant = (chatRoom: ChatRoom): User => {
    return chatRoom.participants.find(p => p.id !== user.id)!;
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 1000 * 60) return "방금 전";
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}분 전`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}일 전`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24))}일 전`;
  };

  return (
    <PageContainer>
      <MainContent>
        <PageTitle>채팅</PageTitle>
        
        {chatRooms.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>아직 채팅방이 없습니다</EmptyText>
            <EmptySubText>매칭된 상대방과 대화를 시작해보세요</EmptySubText>
          </EmptyState>
        ) : (
          <ChatRoomList>
            {chatRooms.map((chatRoom) => {
              const otherUser = getOtherParticipant(chatRoom);
              return (
                <ChatRoomItem 
                  key={chatRoom.id}
                  onClick={() => handleChatRoomClick(chatRoom.id)}
                >
                  <UserAvatar>
                    <AvatarImage src={otherUser.profileImageUrl} alt={otherUser.name} />
                    <OnlineIndicator $isOnline={otherUser.isOnline || false} />
                  </UserAvatar>
                  
                  <ChatRoomInfo>
                    <ChatRoomHeader>
                      <UserName>{otherUser.name}</UserName>
                      <LastMessageTime>{formatTime(chatRoom.updatedAt)}</LastMessageTime>
                    </ChatRoomHeader>
                    
                    <LastMessage>
                      {chatRoom.lastMessage?.content || "새로운 채팅방입니다"}
                    </LastMessage>
                  </ChatRoomInfo>
                  
                  {chatRoom.unreadCount > 0 && (
                    <UnreadBadge>{chatRoom.unreadCount}</UnreadBadge>
                  )}
                </ChatRoomItem>
              );
            })}
          </ChatRoomList>
        )}
      </MainContent>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.white};
`;

const MainContent = styled.main`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1rem 0 1.5rem;
  color: ${colors.gray[900]};
`;

const ChatRoomList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ChatRoomItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: ${colors.white};
  border: 1px solid ${colors.gray[200]};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.blue[300]};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const UserAvatar = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const AvatarImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
`;

const OnlineIndicator = styled.div<{ $isOnline: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${props => props.$isOnline ? colors.green[500] : colors.gray[400]};
  border: 2px solid ${colors.white};
`;

const ChatRoomInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatRoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${colors.gray[900]};
  font-size: 0.9375rem;
`;

const LastMessageTime = styled.span`
  font-size: 0.75rem;
  color: ${colors.gray[500]};
`;

const LastMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  border-radius: 0.625rem;
  background-color: ${colors.blue[600]};
  color: ${colors.white};
  font-size: 0.75rem;
  font-weight: 600;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.gray[700]};
  margin: 0 0 0.5rem;
`;

const EmptySubText = styled.p`
  font-size: 0.875rem;
  color: ${colors.gray[500]};
  margin: 0;
`;
