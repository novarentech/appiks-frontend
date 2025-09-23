import { useState, useEffect } from "react";
import { getTags } from "@/lib/api";
import { TagResponse, Tag } from "@/types/api";

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
        const result: TagResponse = await getTags();

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