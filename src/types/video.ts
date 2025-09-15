export interface Tag {
  id: number;
  title: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  channel: string;
  views: number;
  video_id: string;
  school: string;
  tags: Tag[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type TagsResponse = ApiResponse<Tag[]>;
export type VideosResponse = ApiResponse<Video[]>;
export type VideosByTagResponse = ApiResponse<Video[]>;
export type VideoDetailResponse = ApiResponse<Video>;
