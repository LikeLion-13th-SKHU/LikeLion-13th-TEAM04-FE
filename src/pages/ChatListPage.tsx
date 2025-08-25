import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { colors } from "../styles/theme";
import { useAuth } from "../contexts/AuthContext";
import {
  getChatRooms,
  type ChatRoomItem as ChatRoomItemType,
} from "../api/chat";

export default function ChatListPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [chatRooms, setChatRooms] = useState<ChatRoomItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 채팅방 데이터 가져오기
  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await getChatRooms();

        if (response.success) {
          setChatRooms(response.data || []);
        } else {
          setError(response.message || "채팅방을 불러오는데 실패했습니다.");
          setChatRooms([]);
        }
      } catch (error) {
        setError("채팅방을 불러오는데 실패했습니다.");
        setChatRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, [isAuthenticated, user]);

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleOpenRoom = (chatRoom: ChatRoomItemType) => {
    const profile = chatRoom.participantProfile;
    const otherId =
      profile && typeof profile.userId === "number"
        ? profile.userId
        : chatRoom.participantId;
    const name = profile?.name || chatRoom.name || `채팅방 ${chatRoom.id}`;
    const profileImageUrl = profile?.profileImage || "";
    navigate(`/chat/${chatRoom.id}`, {
      state: { otherUser: { id: String(otherId), name, profileImageUrl } },
    });
  };

  const formatTime = (timestamp: string) => {
    const normalized = timestamp?.replaceAll?.(".", "-") || timestamp;
    const date = new Date(normalized);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (Number.isNaN(diff)) return "";
    if (diff < 1000 * 60) return "방금 전";
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}분 전`;
    if (diff < 1000 * 60 * 60 * 24)
      return `${Math.floor(diff / (1000 * 60 * 60))}시간 전`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24))}일 전`;
  };

  return (
    <PageContainer>
      <MainContent>
        <PageTitle>채팅</PageTitle>

        {isLoading ? (
          <LoadingState>
            <LoadingIcon>⏳</LoadingIcon>
            <LoadingText>채팅방을 불러오는 중...</LoadingText>
          </LoadingState>
        ) : error ? (
          <ErrorState>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorText>{error}</ErrorText>
            <RetryButton onClick={() => window.location.reload()}>
              다시 시도
            </RetryButton>
          </ErrorState>
        ) : chatRooms.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>아직 채팅방이 없습니다</EmptyText>
            <EmptySubText>매칭된 상대방과 대화를 시작해보세요</EmptySubText>
          </EmptyState>
        ) : (
          <ChatRoomList>
            {chatRooms.map((chatRoom) => {
              const avatar =
                chatRoom.participantProfile?.profileImage ||
                "/default-avatar.png";
              const displayName = `no`;
              return (
                <ChatRoomItem
                  key={chatRoom.id}
                  onClick={() => handleOpenRoom(chatRoom)}
                >
                  <UserAvatar>
                    <AvatarImage src={avatar} alt={displayName} />
                  </UserAvatar>

                  <ChatRoomInfo>
                    <ChatRoomHeader>
                      <UserName>{displayName}</UserName>
                      <LastMessageTime>
                        {formatTime(chatRoom.createdAt)}
                      </LastMessageTime>
                    </ChatRoomHeader>

                    <LastMessage>
                      {chatRoom.postId
                        ? `공고글 #${chatRoom.name} 관련 채팅`
                        : "AI 봇 채팅방입니다"}
                    </LastMessage>
                  </ChatRoomInfo>
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

// Unread badge 스타일은 추후 서버 연동 시 사용 예정

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

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const LoadingIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: ${colors.gray[600]};
  margin: 0;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: ${colors.red[600]};
  margin: 0 0 1rem 0;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${colors.blue[600]};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.blue[700]};
  }
`;
