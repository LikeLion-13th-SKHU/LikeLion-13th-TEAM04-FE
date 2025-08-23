import { axiosInstance } from "../utils/apiConfig";
import type { BackendPostsResponse } from "../types/notice";
import type { BackendPostDetailResponse } from "../types/notice";
import type { NoticeCategory } from "../types/notice";

export interface FetchPostsParams {
  keyword?: string;
  category?: string;
  page?: number; // 1-based from UI
  size?: number;
  sort?: string; // e.g., "createAt,desc"
}

export const getPosts = async ({
  keyword,
  category,
  page = 1,
  size = 10,
  sort,
}: FetchPostsParams) => {
  const params: Record<string, any> = {
    page: Math.max(page - 1, 0),
    size,
  };

  if (keyword) params.keyword = keyword;
  if (category) params.category = category;
  if (sort) params.sort = sort;

  const res = await axiosInstance.get<BackendPostsResponse>(`/posts`, {
    params,
  });

  return res.data;
};

export const getPostDetail = async (postId: string | number) => {
  const res = await axiosInstance.get<BackendPostDetailResponse>(
    `/posts/${postId}`
  );
  return res.data;
};

export interface CreatePostPayload {
  category: NoticeCategory; // string(enum)
  title: string;
  content: string;
  location: string;
  salary?: number; // int
  work_time: string;
  deadline?: string; // date string
  num?: number; // int
  work_period: string; // e.g., "2025.07.27~2025.07.28" or free text per backend
  tags?: string; // comma-separated
  image?: File | null; // single file for now
  createAt?: string; // date string; usually server-side
}

export const createPost = async (payload: CreatePostPayload) => {
  const form = new FormData();

  form.append("category", payload.category);
  form.append("title", payload.title);
  form.append("content", payload.content);
  form.append("location", payload.location);

  form.append("salary", String(payload.salary));
  form.append("num", String(payload.num));

  const workTime = payload.work_time.replace(/\s+/g, "").replace(/-/g, "~");
  form.append("work_time", workTime);

  if (payload.deadline && payload.deadline.trim().length > 0) {
    const deadline = payload.deadline
      .trim()
      .replace(/\s+/g, "")
      .replaceAll("-", ".");
    form.append("deadline", deadline);
  }

  const workPeriod = payload.work_period
    .trim()
    .replace(/\s+/g, "")
    .replaceAll("-", ".");
  form.append("work_period", workPeriod);

  if (payload.tags && payload.tags.trim().length > 0) {
    form.append("tags", payload.tags.trim());
  }

  if (payload.image instanceof File) {
    form.append("image", payload.image);
  }

  if (payload.createAt && payload.createAt.trim().length > 0) {
    const createAt = payload.createAt.trim().replaceAll(".", "-");
    form.append("createAt", createAt);
  }

  const res = await axiosInstance.post(`/posts/save`, form);
  console.log(res);

  return res.data;
};
