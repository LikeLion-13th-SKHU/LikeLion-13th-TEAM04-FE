import styled from "styled-components";
import { colors } from "../../styles/theme";
import type { NoticePost } from "../../types/notice";
import { useNavigate } from "react-router-dom";

export interface NoticeTableProps {
  items: NoticePost[];
}

const NoticeTable = ({ items }: NoticeTableProps) => {
  const navigate = useNavigate();

  return (
    <Table role="table" aria-label="공고 리스트">
      <thead>
        <tr>
          <Th>지역</Th>
          <Th>공고 제목</Th>
          <Th align="right">급여</Th>
          <Th align="center">등록일</Th>
        </tr>
      </thead>
      <tbody>
        {items.map((p) => (
          <Tr key={p.id} onClick={() => navigate(`/notices/${p.id}`)}>
            <Td>{p.region}</Td>
            <Td>{p.title}</Td>
            <Td align="right">{Number(p.pay).toLocaleString()}원</Td>
            <Td align="center">{p.createdAt}</Td>
          </Tr>
        ))}
        {items.length === 0 && (
          <Tr>
            <Td colSpan={4} align="center">
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
