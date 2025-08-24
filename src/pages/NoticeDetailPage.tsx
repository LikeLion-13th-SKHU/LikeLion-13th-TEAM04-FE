import styled from "styled-components";
import { colors } from "../styles/theme";
import type { NoticePost } from "../types/notice";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostDetail } from "../api/posts";

// 목업 제거, 실제 API 사용

const NoticeDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<NoticePost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

const Loading = styled.div`
  margin: 0.5rem 0 1rem;
`;

const ErrorText = styled.div`
  color: ${colors.red?.[600] || "#dc2626"};
  margin: 0.5rem 0 1rem;
`;
