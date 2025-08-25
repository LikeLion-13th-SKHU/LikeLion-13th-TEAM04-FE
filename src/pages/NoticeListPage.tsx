import styled from "styled-components";
import { colors } from "../styles/theme";
import type { NoticePost } from "../types/notice";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NoticeSearchBar from "../components/notices/NoticeSearchBar";
import NoticeFilters from "../components/notices/NoticeFilters";
import NoticeTable from "../components/notices/NoticeTable";
import NoticePagination from "../components/notices/NoticePagination";
import { getPosts } from "../api/posts";

const categories: string[] = [
  "CAFE",
  "RESTAURANT",
  "SUPERMARKET",
  "LIFE",
  "EDUCATION",
  "CULTURE",
  "ADD",
];

const DEFAULT_SIZE = 10;

const NoticeListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = Number(searchParams.get("page") || 1);
  const initialSize = Number(searchParams.get("size") || DEFAULT_SIZE);
  const initialQ = searchParams.get("q") || "";

  const initialCategory = (searchParams.get("category") as string) || "ALL";

  const [q, setQ] = useState<string>(initialQ);

  const [category, setCategory] = useState<string>(initialCategory || "ALL");
  const [page, setPage] = useState<number>(initialPage);
  const [size] = useState<number>(initialSize);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverTotalPages, setServerTotalPages] = useState<number | null>(null);
  const [serverItems, setServerItems] = useState<NoticePost[] | null>(null);

  // URL 쿼리 동기화
  useEffect(() => {
    const params: Record<string, string> = {
      page: String(page),
      size: String(size),
    };
    if (category) params.category = category;
    if (q) params.q = q;
    setSearchParams(params);
  }, [q, category, page, size, setSearchParams]);

  useEffect(() => {
    setPage(1);
  }, [q, category]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getPosts({
          keyword: q || undefined,
          category: category,
          page,
          size,
          sort: "createAt,desc",
        });

        if (cancelled) return;
        const posts = res.data.posts.map((p) => ({
          id: String(p.post_id),
          title: p.title,
          region: p.location,
          pay: p.salary,
          createdAt: p.createAt,
          category: (category as any) || "기타",
          authorId: p.memberId,
        })) as NoticePost[];
        setServerItems(posts);
        setServerTotalPages(res.data.pagination.totalPages || 1);
      } catch (e: any) {
        if (cancelled) return;
        setError(e.message || "불러오기에 실패했습니다.");
        setServerItems(null);
        setServerTotalPages(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [q, category, page, size]);

  const totalPages =
    serverTotalPages ??
    Math.max(1, Math.ceil((serverItems?.length ?? 0) / size));
  const content = useMemo(() => {
    if (!serverItems) return [];
    const start = (page - 1) * size;
    return serverItems.slice(start, start + size);
  }, [serverItems, page, size]);

  return (
    <PageRoot>
      <Container>
        <PageTitle>전체 공고글</PageTitle>

        <NoticeSearchBar value={q} onChange={setQ} />

        <NoticeFilters
          category={category}
          categories={categories}
          onChangeCategory={(category) => setCategory(category)}
        />

        {loading ? (
          <TableSkeleton>불러오는 중...</TableSkeleton>
        ) : error ? (
          <TableSkeleton>{error}</TableSkeleton>
        ) : (
          <NoticeTable items={content} />
        )}

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

const TableSkeleton = styled.div`
  width: 100%;
  border-top: 1px solid ${colors.blue[300]};
  padding: 2rem 0;
  text-align: center;
  color: ${colors.gray[900]};
`;
