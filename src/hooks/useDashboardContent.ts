import { useState, useEffect } from "react";
import { getDashboardContent } from "@/lib/api";
import { DashboardContentResponse, DashboardContentItem } from "@/types/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardContent(): UseApiState<DashboardContentItem[]> {
  const [data, setData] = useState<DashboardContentItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const result: DashboardContentResponse = await getDashboardContent();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch dashboard content"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardContent();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardContent,
  };
}