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

  const trimmed = (keyword || "").trim();
  if (trimmed.length > 0) params.keyword = trimmed;

  params.category = category;

  if (category === "ALL" && sort) {
    params.sort = sort;
  } else {
    params.sort = null;
  }

  console.log(params.category);

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

export const deletePost = async (postId: string | number) => {
  const res = await axiosInstance.delete(`/posts/${postId}`);
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

export type UpdatePostPayload = Partial<
  Pick<
    CreatePostPayload,
    | "title"
    | "content"
    | "location"
    | "salary"
    | "work_time"
    | "deadline"
    | "num"
    | "work_period"
    | "tags"
  >
>;

export const updatePost = async (
  postId: string | number,
  payload: UpdatePostPayload
) => {
  const body: Record<string, any> = {};

  if (payload.title !== undefined) body.title = payload.title;
  if (payload.content !== undefined) body.content = payload.content;
  if (payload.location !== undefined) body.location = payload.location;
  if (payload.salary !== undefined) body.salary = payload.salary;
  if (payload.num !== undefined) body.num = payload.num;
  if (payload.tags !== undefined) body.tags = payload.tags;

  if (payload.work_time !== undefined) {
    body.work_time = payload.work_time.replace(/\s+/g, "").replace(/-/g, "~");
  }

  if (payload.deadline !== undefined && payload.deadline.trim().length > 0) {
    body.deadline = payload.deadline
      .trim()
      .replace(/\s+/g, "")
      .replaceAll("-", ".");
  }

  if (payload.work_period !== undefined) {
    body.work_period = payload.work_period
      .trim()
      .replace(/\s+/g, "")
      .replaceAll("-", ".");
  }

  const res = await axiosInstance.patch(`/posts/${postId}`, body, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
