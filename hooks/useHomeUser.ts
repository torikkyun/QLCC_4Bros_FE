import { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import React from "react";
import {
  getElectionResults,
  getOngoingElectionId,
} from "@/api/services/homeUser.service";

export function useHomeUser() {
  const [candidate, setCandidate] = useState<{
    name: string;
    description: string;
    voteCount: string;
    image?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [electionId, setElectionId] = useState<number | null>(null);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      const electionId = await getOngoingElectionId();
      if (!electionId) {
        setError("Không tìm thấy election đang hoạt động.");
        return;
      }
      setElectionId(electionId);

      const results = await getElectionResults(electionId);
      if (results.length > 0) {
        const first = results[0];
        const user = first.user;
        setCandidate({
          name: `${user.firstName} ${user.lastName}`,
          description: first.description,
          voteCount: first.voteCount,
        });
      } else {
        setError("Không có ứng cử viên.");
      }
    } catch (err: any) {
      console.error("Error in fetchCandidate:", err.message);
      setError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCandidate();
    }, [])
  );

  return { candidate, loading, error, electionId };
}
