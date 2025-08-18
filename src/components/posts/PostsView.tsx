import styled from "styled-components";
import { colors } from "../../styles/theme";
import PageTitle from "../common/PageTitle";
import { User } from "../../types/user";

interface PostsViewProps {
  testUser: User;
}

export default function PostsView({ testUser }: PostsViewProps) {
  return (
    <>
      <PageTitle>내 공고</PageTitle>

      {/* 검색 및 필터 섹션 */}
      <SearchSection>
        <SearchInput 
          type="text" 
          placeholder="공고 제목을 입력해 주세요."
        />
        <FilterRow>
          <FilterSelect>
            <option value="">지역</option>
            <option value="seoul">서울</option>
            <option value="busan">부산</option>
            <option value="daegu">대구</option>
          </FilterSelect>
          <FilterSelect>
            <option value="">전체</option>
          </FilterSelect>
        </FilterRow>
      </SearchSection>

      {/* 공고 목록 테이블 */}
      <PostsTable>
        <TableHeader>
          <TableHeaderCell>지역</TableHeaderCell>
          <TableHeaderCell>공고 제목</TableHeaderCell>
          <TableHeaderCell>급여</TableHeaderCell>
          <TableHeaderCell>등록일</TableHeaderCell>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>서울시 노원구</TableCell>
            <TableCell>카페 알바 구합니다</TableCell>
            <TableCell>시급 12,000원</TableCell>
            <TableCell>2025.08.14</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>서울시 강남구</TableCell>
            <TableCell>식당 주방 보조</TableCell>
            <TableCell>월급 280만원</TableCell>
            <TableCell>2025.08.14</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>서울시 마포구</TableCell>
            <TableCell>편의점 야간 알바</TableCell>
            <TableCell>시급 13,000원</TableCell>
            <TableCell>2025.08.14</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>서울시 서초구</TableCell>
            <TableCell>사무실 청소 일용직</TableCell>
            <TableCell>일당 15만원</TableCell>
            <TableCell>2025.08.14</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>서울시 송파구</TableCell>
            <TableCell>배달 라이더</TableCell>
            <TableCell>건당 3,000원</TableCell>
            <TableCell>2025.08.14</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>서울시 영등포구</TableCell>
            <TableCell>창고 물류 보조</TableCell>
            <TableCell>시급 11,000원</TableCell>
            <TableCell>2025.08.14</TableCell>
          </TableRow>
        </TableBody>
      </PostsTable>

      {/* 페이지네이션 */}
      <Pagination>
        <PageButton active>1</PageButton>
        <PageButton>2</PageButton>
        <PageButton>3</PageButton>
        <PageButton>4</PageButton>
        <PageButton>5</PageButton>
        <PageButton>→</PageButton>
      </Pagination>
    </>
  );
}



const SearchSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${colors.gray[100]};
  border-radius: 0.75rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${colors.blue[900]};
    box-shadow: 0 0 0 2px ${colors.blue[100]};
  }
  
  &::placeholder {
    color: ${colors.gray[900]};
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterSelect = styled.select`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${colors.blue[900]};
  }
`;

const PostsTable = styled.div`
  margin-bottom: 2rem;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.5rem;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  background-color: ${colors.blue[100]};
  border-bottom: 1px solid ${colors.blue[300]};
`;

const TableHeaderCell = styled.div`
  padding: 1rem;
  font-weight: 700;
  color: ${colors.blue[900]};
  text-align: center;
  border-right: 1px solid ${colors.blue[300]};
  
  &:last-child {
    border-right: none;
  }
`;

const TableBody = styled.div`
  background-color: white;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  border-bottom: 1px solid ${colors.blue[300]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  padding: 1rem;
  text-align: center;
  border-right: 1px solid ${colors.blue[300]};
  color: ${colors.gray[900]};
  
  &:last-child {
    border-right: none;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.active ? colors.blue[900] : colors.blue[300]};
  background-color: ${props => props.active ? colors.blue[900] : 'white'};
  color: ${props => props.active ? 'white' : colors.blue[900]};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? colors.blue[700] : colors.blue[100]};
    border-color: ${props => props.active ? colors.blue[700] : colors.blue[500]};
  }
`;
