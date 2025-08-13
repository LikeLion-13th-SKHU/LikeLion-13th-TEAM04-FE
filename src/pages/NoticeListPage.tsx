import styled from "styled-components";
import { colors } from "../styles/theme";
import type { NoticePost, NoticeCategory } from "../types/notice";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NoticeSearchBar from "../components/notices/NoticeSearchBar";
import NoticeFilters from "../components/notices/NoticeFilters";
import NoticeTable from "../components/notices/NoticeTable";
import NoticePagination from "../components/notices/NoticePagination";

const regions = ["전체", "서울", "경기", "인천", "부산", "대구", "대전"];
const categories: NoticeCategory[] = [
  "디자인",
  "개발",
  "영상",
  "마케팅",
  "기타",
];

const DEFAULT_SIZE = 10;

const makeMockPosts = (count = 36): NoticePost[] => {
  const regionPool = [
    "서울시 노원구",
    "서울시 마포구",
    "경기도 성남시",
    "인천시 연수구",
    "부산시 해운대구",
    "대구시 수성구",
    "대전시 서구",
  ];
  const categoryPool: NoticeCategory[] = [
    "디자인",
    "개발",
    "영상",
    "마케팅",
    "기타",
  ];
  const baseTitle = [
    "홍보 영상 제작",
    "웹사이트 퍼블리싱",
    "브랜드 로고 디자인",
    "인스타그램 운영 대행",
    "상세 페이지 제작",
  ];
  const today = new Date();
  const result: NoticePost[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (i % 20));
    const createdAt = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
    result.push({
      id: String(i + 1),
      region: regionPool[i % regionPool.length],
      title: `${baseTitle[i % baseTitle.length]} 프로젝트 #${i + 1}`,
      pay: 200000 + (i % 6) * 50000,
      createdAt,
      category: categoryPool[i % categoryPool.length],
    });
  }
  return result;
};

const ALL_POSTS = makeMockPosts();

const NoticeListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = Number(searchParams.get("page") || 1);
  const initialSize = Number(searchParams.get("size") || DEFAULT_SIZE);
  const initialQ = searchParams.get("q") || "";
  const initialRegion = searchParams.get("region") || "전체";
  const initialCategory = (searchParams.get("category") as any) || "전체";

  const [q, setQ] = useState<string>(initialQ);
  const [region, setRegion] = useState<string>(initialRegion);
  const [category, setCategory] = useState<NoticeCategory | "전체">(
    initialCategory
  );
  const [page, setPage] = useState<number>(initialPage);
  const [size] = useState<number>(initialSize);

  // URL 쿼리 동기화
  useEffect(() => {
    const params: Record<string, string> = {
      page: String(page),
      size: String(size),
    };
    if (q) params.q = q;
    if (region !== "전체") params.region = region;
    if (category !== "전체") params.category = String(category);
    setSearchParams(params);
  }, [q, region, category, page, size, setSearchParams]);

  // 클라이언트 사이드 필터링/페이징
  const filtered = useMemo(() => {
    const lowerQ = q.trim().toLowerCase();
    return ALL_POSTS.filter((p) => {
      const matchQ = lowerQ
        ? p.title.toLowerCase().includes(lowerQ) ||
          p.region.toLowerCase().includes(lowerQ)
        : true;
      const matchRegion = region === "전체" ? true : p.region.includes(region);
      const matchCategory =
        category === "전체" ? true : p.category === category;
      return matchQ && matchRegion && matchCategory;
    });
  }, [q, region, category]);

  useEffect(() => {
    // 필터/검색 변경 시 1페이지로
    setPage(1);
  }, [q, region, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const content = useMemo(() => {
    const start = (page - 1) * size;
    return filtered.slice(start, start + size);
  }, [filtered, page, size]);

  return (
    <PageRoot>
      <Container>
        <PageTitle>전체 공고글</PageTitle>

        <NoticeSearchBar value={q} onChange={setQ} />

        <NoticeFilters
          region={region}
          category={category}
          regions={regions}
          categories={categories}
          onChangeRegion={setRegion}
          onChangeCategory={setCategory}
        />

        <NoticeTable items={content} />

        <NoticePagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </Container>
    </PageRoot>
  );
};

export default NoticeListPage;

const PageRoot = styled.main`
  display: block;
  min-height: 100vh;
`;

const Container = styled.div`
  width: 72rem;
  margin: 0 auto;
  padding: 2rem 0 4rem;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: ${colors.gray[900]};
`;
