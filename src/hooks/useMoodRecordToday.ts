"use client";

import { useState, useEffect } from "react";

interface MoodRecord {
  type: "angry" | "sad" | "happy" | "neutral";
  status: "insecure" | "secure";
}

export function useMoodRecordToday() {
  const [data, setData] = useState<MoodRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoodRecord = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/mood-record/today");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Failed to fetch mood record");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMoodRecord();
  }, []);

  return { data, loading, error };
}