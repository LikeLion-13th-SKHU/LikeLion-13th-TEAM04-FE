import styled from "styled-components";
import { colors } from "../styles/theme";
import { useMemo, useRef, useState } from "react";
import type { NoticeCategory } from "../types/notice";
import { createPost } from "../api/posts";

import { useNavigate } from "react-router-dom";

const categories: NoticeCategory[] = [
  "CAFE",
  "RESTAURANT",
  "SUPERMARKET",
  "LIFE",
  "EDUCATION",
  "CULTURE",
  "ADD",
];

const categoryLabelMap: Record<NoticeCategory, string> = {
  CAFE: "카페",
  RESTAURANT: "음식점",
  SUPERMARKET: "마트",
  LIFE: "생활",
  EDUCATION: "교육",
  CULTURE: "문화",
  ADD: "기타",
};

const NoticeCreatePage = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState<NoticeCategory | "">("");
  const [region, setRegion] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [pay, setPay] = useState<string>("");
  const [headcount, setHeadcount] = useState<string>("");
  const [workHours, setWorkHours] = useState<string>("");
  const [workStart, setWorkStart] = useState<string>("");
  const [workEnd, setWorkEnd] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [recruitEnd, setRecruitEnd] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const formatDateIso = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`; // Spring LocalDate 기본 포맷
  };

  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    // 최대 5장까지 허용 (필요 시 변경 가능)
    setFiles(selected.slice(0, 5));
  };

  const onClickUpload = () => fileInputRef.current?.click();

  const onRemoveFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const t = title.trim();
    const c = description.trim();
    const loc = region.trim();
    const wt = workHours.trim();

    if (!category || !t || !c || !loc || !wt) {
      alert(
        "필수 항목(카테고리, 제목, 내용, 위치, 일하는 시간)을 입력해 주세요."
      );
      return;
    }
    if (c.length < 10) {
      alert("내용은 최소 10자 이상 작성해 주세요.");
      return;
    }
    if ((workStart && !workEnd) || (!workStart && workEnd)) {
      alert("근무 기간 시작/종료를 모두 선택해 주세요.");
      return;
    }

    try {
      setSubmitting(true);
      const work_period = `${workStart}~${workEnd}`;
      const image = files[0] ?? null;

      await createPost({
        category: category as NoticeCategory,
        title: t,
        content: c,
        location: loc,
        salary: pay ? Number(pay) : undefined,
        work_time: wt,
        deadline: recruitEnd || undefined,
        num: headcount ? Number(headcount) : undefined,
        work_period,
        tags,
        image,
        createAt: formatDateIso(new Date()),
      });

      alert("공고가 등록되었습니다.");
      navigate("/notices");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "등록에 실패했습니다.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = () => navigate("/notices");

  return (
    <PageRoot>
      <Container>
        <Title>공고 작성하기</Title>
        <Form onSubmit={onSubmit}>
          <Row>
            <Label>카테고리</Label>
            <Field>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
              >
                <option value="">선택</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabelMap[c]}
                  </option>
                ))}
              </Select>
            </Field>
            <Label>지역 설정</Label>
            <Field>
              <Input
                placeholder="예: 서울시 노원구"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </Field>
          </Row>

          <Row>
            <Label>공고 제목</Label>
            <Field colSpan={3}>
              <Input
                placeholder="공고 제목을 작성해 주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
          </Row>

          <Row>
            <Label>급여</Label>
            <Field>
              <Input
                inputMode="numeric"
                placeholder="급여를 작성해 주세요."
                value={pay}
                onChange={(e) => setPay(e.target.value)}
              />
            </Field>

            <Label>모집 인원</Label>
            <Field>
              <Input
                inputMode="numeric"
                placeholder="모집 인원을 작성해 주세요."
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value)}
              />
            </Field>
          </Row>

          <Row>
            <Label>근무 시간</Label>
            <Field>
              <Input
                placeholder="근무 시간을 작성해 주세요."
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
              />
            </Field>
            <Label>근무 기간</Label>
            <Field>
              <Inline>
                <Input
                  type="date"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                />
                <span>~</span>
                <Input
                  type="date"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                />
              </Inline>
            </Field>
          </Row>

          <Row>
            <Label>태그</Label>
            <Field colSpan={3}>
              <Input
                placeholder="태그를 쉼표(,)로 구분해 입력하세요."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Field>
          </Row>

          <Row>
            <Label>상세 요강</Label>
            <Field colSpan={3}>
              <Textarea
                placeholder="상세 요강을 작성해 주세요."
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </Row>

          <Row>
            <Label>사진 업로드</Label>
            <Field colSpan={3}>
              <UploadActions>
                <HiddenFileInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onSelectFiles}
                />
                <UploadButton type="button" onClick={onClickUpload}>
                  이미지 선택
                </UploadButton>
              </UploadActions>
              {previews.length > 0 && (
                <PreviewList>
                  {previews.map((src, idx) => (
                    <PreviewItem key={idx}>
                      <RemoveThumb
                        type="button"
                        aria-label="이미지 삭제"
                        onClick={() => onRemoveFile(idx)}
                      >
                        ×
                      </RemoveThumb>
                      <img src={src} alt={`preview-${idx}`} />
                    </PreviewItem>
                  ))}
                </PreviewList>
              )}
            </Field>
          </Row>

          <Row>
            <Label>모집 기간</Label>
            <Field>
              <Input
                type="date"
                value={recruitEnd}
                onChange={(e) => setRecruitEnd(e.target.value)}
              />
            </Field>
          </Row>

          <Actions>
            <CancelButton type="button" onClick={onCancel}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? "등록 중..." : "작성하기"}
            </SubmitButton>
          </Actions>
        </Form>
      </Container>
    </PageRoot>
  );
};

export default NoticeCreatePage;

const PageRoot = styled.main`
  display: block;
  min-height: 100vh;
`;

const Container = styled.div`
  width: 72rem;
  margin: 0 auto;
  padding: 1rem 0 4rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
  color: ${colors.gray[900]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 4rem 1fr 4rem 1fr;
  align-items: center;
  column-gap: 1.75rem;
  row-gap: 1rem;
`;

const Label = styled.label`
  color: ${colors.gray[900]};
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
  height: 2.5rem;
`;

const Field = styled.div<{ colSpan?: number }>`
  grid-column: span ${(p) => p.colSpan || 1};
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.5rem;
  padding: 0 0.75rem;
  font-size: 0.95rem;
  outline: none;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;

  &::placeholder {
    color: #9aa3af;
  }

  &:focus {
    border-color: ${colors.blue[900]};
    box-shadow: 0 0 0 3px ${colors.blue[100]};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.95rem;
  outline: none;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;

  &::placeholder {
    color: #9aa3af;
  }

  &:focus {
    border-color: ${colors.blue[900]};
    box-shadow: 0 0 0 3px ${colors.blue[100]};
  }
`;

const Select = styled.select`
  width: 100%;
  height: 2.5rem;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  background: ${colors.white};
  font-size: 0.95rem;
  outline: none;

  &:focus {
    border-color: ${colors.blue[900]};
    box-shadow: 0 0 0 3px ${colors.blue[100]};
  }
`;

const Inline = styled.div`
  display: flex;
  align-items: center;
  gap: 2.6rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const UploadButton = styled.button`
  height: 2.25rem;
  padding: 0 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.blue[300]};
  background: ${colors.white};
  color: ${colors.gray[900]};
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${colors.gray[100]};
  }
`;

const PreviewList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const PreviewItem = styled.li`
  width: 10rem;
  height: 10rem;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.5rem;
  overflow: hidden;
  background: ${colors.white};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const RemoveThumb = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: 1px solid ${colors.blue[300]};
  background: ${colors.white};
  color: ${colors.gray[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 1;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ButtonBase = styled.button`
  height: 2.5rem;
  padding: 0 0.875rem;
  border-radius: 0.5rem;
  font-weight: 700;
  transition: background-color 0.15s ease, color 0.15s ease,
    border-color 0.15s ease;
`;

const CancelButton = styled(ButtonBase)`
  background: ${colors.white};
  color: ${colors.gray[900]};
  border: 1px solid ${colors.blue[300]};

  &:hover {
    background: ${colors.gray[100]};
  }
`;

const SubmitButton = styled(ButtonBase)`
  background: ${colors.blue[900]};
  color: ${colors.white};
  border: none;

  &:hover {
    background: ${colors.blue[700]};
  }
`;
