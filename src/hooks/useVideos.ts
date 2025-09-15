import { useState, useEffect } from "react";
import {
  Tag,
  Video,
  TagsResponse,
  VideosResponse,
  VideosByTagResponse,
  VideoDetailResponse,
} from "@/types/video";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useTags(): UseApiState<Tag[]> {
  const [state, setState] = useState<UseApiState<Tag[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const response = await fetch("/api/tag");
        const result: TagsResponse = await response.json();

        if (result.success) {
          setState({ data: result.data, loading: false, error: null });
        } else {
          setState({ data: null, loading: false, error: result.message });
        }
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error ? error.message : "Failed to fetch tags",
        });
      }
    };

    fetchTags();
  }, []);

  return state;
}

export function useVideos(): UseApiState<Video[]> {
  const [state, setState] = useState<UseApiState<Video[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const response = await fetch("/api/video");
        const result: VideosResponse = await response.json();

        if (result.success) {
          setState({ data: result.data, loading: false, error: null });
        } else {
          setState({ data: null, loading: false, error: result.message });
        }
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error ? error.message : "Failed to fetch videos",
        });
      }
    };

    fetchVideos();
  }, []);

  return state;
}

export function useVideosByTag(tagId: number | null): UseApiState<Video[]> {
  const [state, setState] = useState<UseApiState<Video[]>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!tagId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchVideosByTag = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const response = await fetch(`/api/video/tag/${tagId}`);
        const result: VideosByTagResponse = await response.json();

        if (result.success) {
          setState({ data: result.data, loading: false, error: null });
        } else {
          setState({ data: null, loading: false, error: result.message });
        }
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch videos by tag",
        });
      }
    };

    fetchVideosByTag();
  }, [tagId]);

  return state;
}

export function useVideosByTags(tagIds: number[]): UseApiState<Video[]> {
  const [state, setState] = useState<UseApiState<Video[]>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!tagIds.length) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchVideosByTags = async () => {
      try {
        setState({ data: null, loading: true, error: null });

        // Fetch videos for each tag and combine results
        const promises = tagIds.map((tagId) =>
          fetch(`/api/video/tag/${tagId}`).then((res) => res.json())
        );

        const results = await Promise.all(promises);

        // Check if all requests were successful
        const failedResults = results.filter((result) => !result.success);
        if (failedResults.length > 0) {
          setState({
            data: null,
            loading: false,
            error: failedResults[0].message || "Failed to fetch videos by tags",
          });
          return;
        }

        // Combine and deduplicate videos
        const allVideos = results.flatMap((result) => result.data);
        const uniqueVideos = allVideos.filter(
          (video, index, self) =>
            index === self.findIndex((v) => v.id === video.id)
        );

        setState({ data: uniqueVideos, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch videos by tags",
        });
      }
    };

    fetchVideosByTags();
  }, [tagIds]);

  return state;
}

export function useVideoDetail(videoId: string | null): UseApiState<Video> {
  const [state, setState] = useState<UseApiState<Video>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!videoId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchVideoDetail = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const response = await fetch(`/api/video/${videoId}`);
        const result: VideoDetailResponse = await response.json();

        if (result.success) {
          setState({ data: result.data, loading: false, error: null });
        } else {
          setState({ data: null, loading: false, error: result.message });
        }
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch video details",
        });
      }
    };

    fetchVideoDetail();
  }, [videoId]);

  return state;
}
