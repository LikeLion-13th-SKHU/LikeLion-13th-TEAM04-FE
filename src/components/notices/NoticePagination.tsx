import styled from "styled-components";
import { colors } from "../../styles/theme";

export interface NoticePaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const NoticePagination = ({
  page,
  totalPages,
  onChange,
}: NoticePaginationProps) => {
  return (
    <Pagination role="navigation" aria-label="페이지네이션">
      <PrevNextButton
        aria-label="이전"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        ◀
      </PrevNextButton>

      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNum = idx + 1;
        return (
          <PageNum
            key={pageNum}
            aria-current={pageNum === page ? "page" : undefined}
            data-active={pageNum === page}
            onClick={() => onChange(pageNum)}
          >
            {pageNum}
          </PageNum>
        );
      })}

      <PrevNextButton
        aria-label="다음"
        onClick={() => onChange(Math.min(page + 1, totalPages))}
        disabled={page >= totalPages}
      >
        ▶
      </PrevNextButton>
    </Pagination>
  );
};

export default NoticePagination;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const PageNum = styled.button`
  border: 1px solid ${colors.blue[300]};
  background: ${colors.white};
  color: ${colors.gray[900]};
  cursor: pointer;
  min-width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease;

  &[aria-current="page"],
  &[data-active="true"] {
    background: ${colors.blue[900]};
    color: ${colors.white};
    border-color: ${colors.blue[900]};
    font-weight: 700;
  }

  &:hover {
    background: ${colors.blue[100]};
  }
`;

const PrevNextButton = styled.button`
  border: 1px solid ${colors.blue[300]};
  background: ${colors.white};
  color: ${colors.gray[900]};
  cursor: pointer;
  min-width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
