import styled from "styled-components";
import { colors } from "../../styles/theme";
import type { NoticePost } from "../../types/notice";
import { useNavigate } from "react-router-dom";
import { createUserChatRoom } from "../../api/chat";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

export interface NoticeTableProps {
  items: NoticePost[];
}

const NoticeTable = ({ items }: NoticeTableProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [chatLoading, setChatLoading] = useState<string | null>(null);

  const handleRowClick = (postId: string) => {
    navigate(`/notices/${postId}`);
  };

  const handleChatClick = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // 행 클릭 이벤트 방지
    
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setChatLoading(postId);
    try {
      // 공고글 작성자의 memberId 사용
      const post = items.find(item => item.id === postId);
      // const authorMemberId = post?.authorId;
      const authorMemberId = 7;

      if (!authorMemberId) {
        alert("작성자 정보를 찾을 수 없습니다.");
        return;
      }
      
      const response = await createUserChatRoom({
        type: "DIRECT",
        otherUserId: authorMemberId,
        roomName: `${post?.title} 지원 문의`,
        postId: Number(postId)
      });
      
      if (response.success) {
        alert("채팅방이 생성되었습니다.");
        navigate("/chat"); // 채팅 목록 페이지로 이동
      } else {
        alert("채팅방 생성에 실패했습니다.");
      }
    } catch (error: any) {
      alert("채팅방 생성 중 오류가 발생했습니다.");
    } finally {
      setChatLoading(null);
    }
  };

  return (
    <Table role="table" aria-label="공고 리스트">
      <thead>
        <tr>
          <Th>지역</Th>
          <Th>공고 제목</Th>
          <Th align="right">급여</Th>
          <Th align="center">등록일</Th>
          <Th align="center">채팅</Th>
        </tr>
      </thead>
      <tbody>
        {items.map((p) => (
          <Tr key={p.id} onClick={() => handleRowClick(p.id)}>
            <Td>{p.region}</Td>
            <Td>{p.title}</Td>
            <Td align="right">{Number(p.pay).toLocaleString()}원</Td>
            <Td align="center">{p.createdAt}</Td>
            <Td align="center">
              {p.authorId && p.authorId !== user?.memberId ? (
                <ChatButton
                  onClick={(e) => handleChatClick(e, p.id)}
                  disabled={chatLoading === p.id}
                >
                  {chatLoading === p.id ? "생성 중..." : "채팅하기"}
                </ChatButton>
              ) : (
                <span style={{ color: colors.gray[400], fontSize: '0.75rem' }}>
                  내 공고
                </span>
              )}
            </Td>
          </Tr>
        ))}
        {items.length === 0 && (
          <Tr>
            <Td colSpan={5} align="center">
              검색 결과가 없습니다.
            </Td>
          </Tr>
        )}
      </tbody>
    </Table>
  );
};

export default NoticeTable;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid ${colors.blue[300]};
`;

const Th = styled.th<{ align?: "left" | "right" | "center" }>`
  text-align: ${(p) => p.align || "left"};
  color: ${colors.gray[900]};
  font-weight: 700;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid ${colors.blue[300]};
`;

const Td = styled.td<{ align?: "left" | "right" | "center" }>`
  text-align: ${(p) => p.align || "left"};
  padding: 0.875rem 0.5rem;
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${colors.blue[300]};
  transition: background-color 0.15s ease;
  cursor: pointer;

  &:hover {
    background: ${colors.blue[100]};
  }
`;

const ChatButton = styled.button`
  padding: 0.375rem 0.75rem;
  border: 1px solid ${colors.green[600]};
  border-radius: 0.375rem;
  background: ${colors.white};
  color: ${colors.green[600]};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.green[600]};
    color: ${colors.white};
  }

  &:disabled {
    background: ${colors.gray[100]};
    border-color: ${colors.gray[300]};
    color: ${colors.gray[500]};
    cursor: not-allowed;
  }
`;
