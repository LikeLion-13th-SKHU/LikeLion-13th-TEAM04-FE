import styled from "styled-components";
import { colors } from "../styles/theme";
import type { NoticePost, NoticeCategory } from "../types/notice";
import { useMemo } from "react";
import { Link } from "react-router-dom";

// 간단한 목업 데이터: 실제에선 API/상태관리로 대체
const MOCK_DETAIL: NoticePost = {
  id: "1",
  region: "서울시 노원구",
  title: "수작카츠 역곡점 30초 홍보 영상 제작팀 모집",
  pay: 300000,
  createdAt: "2025.7.25",
  category: "영상" as NoticeCategory,
  headcount: 1,
  deadline: "2025/08/01",
  workPeriodStart: "2025/08/02",
  workPeriodEnd: "2025/08/26",
  workHours: "-",
  description:
    "안녕하세요 수작카츠 역곡점입니다. 저희는 30초 홍보 영상을 제작해 주실 인재를 찾고 있습니다. 편집 기술을 보유하고 계신 대학생분들 환영입니다.",
  logoUrl: "https://dummyimage.com/400x240/ffffff/2142ab.png&text=SUZAK+KATSU",
};

const NoticeDetailPage = () => {
  const data = useMemo(() => MOCK_DETAIL, []);

  return (
    <PageRoot>
      <Container>
        <BackOverlayLink to="/notices">목록으로</BackOverlayLink>
        <HeaderArea>
          <Logo src={data.logoUrl} alt="업체 로고" />
        </HeaderArea>

        <CategoryBadge>{data.category} 모집</CategoryBadge>
        <Title>{data.title}</Title>

        <Grid>
          <Row>
            <Key>모집 마감</Key>
            <Val>
              {formatDate(data.deadline)} <Due>D-4</Due>
            </Val>
          </Row>
          <Row>
            <Key>급여</Key>
            <Val>{data.pay.toLocaleString()}원</Val>
          </Row>
          <Row>
            <Key>모집 인원</Key>
            <Val>{data.headcount ?? "-"}명</Val>
          </Row>
          <Row>
            <Key>근무 기간</Key>
            <Val>
              {formatDate(data.workPeriodStart)} ~{" "}
              {formatDate(data.workPeriodEnd)}
            </Val>
          </Row>
          <Row>
            <Key>근무 시간</Key>
            <Val>{data.workHours ?? "-"}</Val>
          </Row>
          <Row>
            <Key>근무 지역</Key>
            <Val>{data.region}</Val>
          </Row>
        </Grid>

        <Section>
          <SectionTitle>상세 요강</SectionTitle>
          <Paragraph>{data.description}</Paragraph>
        </Section>

        <Actions>
          <ApplyButton type="button">지원하기</ApplyButton>
        </Actions>
      </Container>
    </PageRoot>
  );
};

export default NoticeDetailPage;

const formatDate = (s?: string) => (s ? s.replaceAll("-", "/") : "-");

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
