import { useState, useEffect } from "react";
import { getArticleDetail, getArticleDetailById } from "@/lib/api";
import { ArticleDetailResponse, ArticleDetail } from "@/types/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useArticleDetail(slug: string | null): UseApiState<ArticleDetail> {
  const [state, setState] = useState<UseApiState<ArticleDetail>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!slug) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchArticleDetail = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const result: ArticleDetailResponse = await getArticleDetail(slug);

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
              : "Failed to fetch article detail",
        });
      }
    };

    fetchArticleDetail();
  }, [slug]);

  return state;
}

export function useArticleDetailById(id: string | null, forceRefresh = false): UseApiState<ArticleDetail> {
  const [state, setState] = useState<UseApiState<ArticleDetail>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchArticleDetail = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const result: ArticleDetailResponse = await getArticleDetailById(id);

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
              : "Failed to fetch article detail",
        });
      }
    };

    fetchArticleDetail();
  }, [id, forceRefresh]);

  return state;
}