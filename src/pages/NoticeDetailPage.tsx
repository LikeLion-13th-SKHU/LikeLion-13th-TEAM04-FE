import styled from "styled-components";
import { colors } from "../styles/theme";
import type { NoticePost } from "../types/notice";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPostDetail, deletePost } from "../api/posts";
import { createUserChatRoom } from "../api/chat";
import { useAuth } from "../contexts/AuthContext";

// 목업 제거, 실제 API 사용

const NoticeDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<NoticePost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error("잘못된 접근입니다.");
        const res = await getPostDetail(id);
        const d = res.data;
        const mapped: NoticePost = {
          id: String(id),
          region: d.location,
          title: d.title,
          pay: d.salary,
          createdAt: d.createAt,
          category: (d.category as any) || "기타",
          headcount: d.num,
          deadline: d.deadline,
          workPeriodStart: d.work_period?.split("~")[0]?.trim(),
          workPeriodEnd: d.work_period?.split("~")[1]?.trim(),
          workHours: d.work_time,
          description: d.content,
          logoUrl: undefined,
          authorId: d.postUserId ?? d.memberId,
          isUser: d.isUser,
        };
        if (!cancelled) setData(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "불러오기에 실패했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // 채팅하기 기능
  const handleStartChat = async () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!data) return;

    // 본인 글이면 채팅 불가
    if (data.isUser || user?.memberId === data.authorId) {
      alert("자신의 공고글과는 채팅할 수 없습니다.");
      return;
    }

    setChatLoading(true);
    try {
      const authorMemberId = data.authorId;

      if (!authorMemberId) {
        alert("작성자 정보를 찾을 수 없습니다.");
        return;
      }

      const response = await createUserChatRoom({
        type: "DIRECT",
        otherUserId: authorMemberId,
        roomName: `${data.title} 지원 문의`,
        postId: Number(id),
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
      setChatLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!data?.isUser) return;
    const ok = window.confirm("정말 이 공고를 삭제하시겠어요?");
    if (!ok) return;
    try {
      await deletePost(id);
      alert("공고가 삭제되었습니다.");
      navigate("/notices");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "삭제에 실패했습니다.";
      alert(msg);
    }
  };

  return (
    <PageRoot>
      <Container>
        <BackOverlayLink to="/notices">목록으로</BackOverlayLink>
        <HeaderArea>
          {data?.logoUrl ? (
            <Logo src={data.logoUrl} alt="업체 로고" />
          ) : (
            <LogoPlaceholder />
          )}
        </HeaderArea>

        {loading && <Loading>불러오는 중...</Loading>}
        {error && <ErrorText>{error}</ErrorText>}
        {!loading && !error && data && (
          <>
            <CategoryBadge>
              {(data.category ?? "기타") as string} 모집
            </CategoryBadge>
            <Title>{data.title}</Title>

            <Grid>
              <Row>
                <Key>모집 마감</Key>
                <Val>
                  {formatDate(data?.deadline)}{" "}
                  <Due>{formatDday(data?.deadline)}</Due>
                </Val>
              </Row>
              <Row>
                <Key>급여</Key>
                <Val>{Number(data?.pay || 0).toLocaleString()}원</Val>
              </Row>
              <Row>
                <Key>모집 인원</Key>
                <Val>{data?.headcount ?? "-"}명</Val>
              </Row>
              <Row>
                <Key>근무 기간</Key>
                <Val>
                  {formatDate(data?.workPeriodStart)} ~{" "}
                  {formatDate(data?.workPeriodEnd)}
                </Val>
              </Row>
              <Row>
                <Key>근무 시간</Key>
                <Val>{data?.workHours ?? "-"}</Val>
              </Row>
              <Row>
                <Key>근무 지역</Key>
                <Val>{data?.region}</Val>
              </Row>
            </Grid>

            <Section>
              <SectionTitle>상세 요강</SectionTitle>
              <Paragraph>{data?.description}</Paragraph>
            </Section>

            <Actions>
              <ApplyButton type="button">지원하기</ApplyButton>
              {!data.isUser && (
                <ChatButton
                  type="button"
                  onClick={handleStartChat}
                  disabled={chatLoading}
                >
                  {chatLoading ? "채팅방 생성 중..." : "이 사람과 채팅하기"}
                </ChatButton>
              )}
              {data.isUser && (
                <>
                  <EditButton
                    type="button"
                    onClick={() =>
                      navigate(`/notices/new`, {
                        state: {
                          mode: "edit",
                          postId: id,
                          initial: data,
                        },
                      })
                    }
                  >
                    수정하기
                  </EditButton>
                  <DeleteButton type="button" onClick={handleDelete}>
                    삭제하기
                  </DeleteButton>
                </>
              )}
            </Actions>
          </>
        )}
      </Container>
    </PageRoot>
  );
};

export default NoticeDetailPage;

const formatDate = (s?: string) => (s ? s.replaceAll("-", "/") : "-");

const formatDday = (deadline?: string) => {
  if (!deadline) return "-";
  // 허용 포맷: YYYY.MM.DD 또는 YYYY-MM-DD
  const norm = deadline.includes(".")
    ? deadline.replaceAll(".", "-")
    : deadline;
  const target = new Date(norm);
  if (isNaN(target.getTime())) return "-";
  const today = new Date();
  // 자정 기준 계산
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const end = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-DAY";
  return `마감`; // 지났을 때
};

const PageRoot = styled.main`
  display: block;
  min-height: 100vh;
`;

const Container = styled.div`
  width: 60rem;
  margin: 0 auto;
  padding: 1rem 0 4rem;
`;

const HeaderArea = styled.div`
  width: 100%;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
`;

const Logo = styled.img`
  max-width: 24rem;
  width: 100%;
  height: auto;
`;

const LogoPlaceholder = styled.div`
  max-width: 24rem;
  width: 100%;
  height: 12rem;
  background: ${colors.gray[100]};
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.5rem;
`;

const BackOverlayLink = styled(Link)`
  height: 2rem;
  padding: 0 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.5rem;
  background: ${colors.white};
  color: ${colors.gray[900]};
  text-decoration: none;
  display: inline-flex;
  align-items: center;

  &:hover {
    background: ${colors.blue[100]};
  }
`;

const CategoryBadge = styled.div`
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${colors.white};
  background: ${colors.blue[900]};
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  line-height: 1.3;
  margin: 0.75rem 0 1.25rem;
  color: ${colors.gray[900]};
`;

const Grid = styled.dl`
  display: grid;
  grid-template-columns: 9rem 1fr;
  row-gap: 0.75rem;
  column-gap: 1.25rem;
  margin-bottom: 1.5rem;
`;

const Row = styled.div`
  display: contents;
`;

const Key = styled.dt`
  color: ${colors.gray[900]};
  font-weight: 700;
`;

const Val = styled.dd``;

const Due = styled.span`
  display: inline-block;
  margin-left: 0.375rem;
  color: ${colors.blue[900]};
  font-weight: 800;
`;

const Section = styled.section`
  margin-top: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`;

const Paragraph = styled.p`
  color: ${colors.gray[900]};
`;

const Actions = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
`;

const ApplyButton = styled.button`
  height: 2.25rem;
  padding: 0 0.875rem;
  border-radius: 0.5rem;
  background: ${colors.blue[900]};
  color: ${colors.white};
  border: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChatButton = styled.button`
  height: 2.25rem;
  padding: 0 0.875rem;
  border-radius: 0.5rem;
  background: ${colors.green[600]};
  color: ${colors.white};
  border: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.green[600]};
  }

  &:disabled {
    background: ${colors.gray[400]};
    cursor: not-allowed;
  }
`;

const EditButton = styled.button`
  height: 2.25rem;
  padding: 0 0.875rem;
  border-radius: 0.5rem;
  background: ${colors.blue[700]};
  color: ${colors.white};
  border: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${colors.blue[800]};
  }
`;

const DeleteButton = styled.button`
  height: 2.25rem;
  padding: 0 0.875rem;
  border-radius: 0.5rem;
  background: ${colors.red[600]};
  color: ${colors.white};
  border: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #b91c1c;
  }
`;

const Loading = styled.div`
  margin: 0.5rem 0 1rem;
`;

const ErrorText = styled.div`
  color: ${colors.red?.[600] || "#dc2626"};
  margin: 0.5rem 0 1rem;
`;
