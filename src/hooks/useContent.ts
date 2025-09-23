import { useState, useEffect } from "react";
import { getContent } from "@/lib/api";
import { ContentResponse, ContentItem } from "@/types/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useContent(): UseApiState<ContentItem[]> {
  const [state, setState] = useState<UseApiState<ContentItem[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const result: ContentResponse = await getContent();

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
            error instanceof Error ? error.message : "Failed to fetch content",
        });
      }
    };

    fetchContent();
  }, []);

  return state;
}

export function useContentByTags(tagIds: number[]): UseApiState<ContentItem[]> {
  const [state, setState] = useState<UseApiState<ContentItem[]>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!tagIds.length) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchContentByTags = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const result: ContentResponse = await getContent();

        if (result.success) {
          // Filter content by selected tag IDs
          const filteredContent = result.data.filter((item) =>
            item.tags.some((tag) => tagIds.includes(tag.id))
          );
          setState({ data: filteredContent, loading: false, error: null });
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
              : "Failed to fetch content by tags",
        });
      }
    };

    fetchContentByTags();
  }, [tagIds]);

  return state;
}

// Helper function to check if content is a video
export function isVideo(content: ContentItem): content is ContentItem & { video_id: string } {
  return "video_id" in content;
}

// Helper function to check if content is an article
export function isArticle(content: ContentItem): content is ContentItem & { slug: string } {
  return "slug" in content;
}