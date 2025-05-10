import { useState, useEffect } from "react";
import { votesService } from "@/api/services/votes.service";
import { electionsService } from "@/api/services/elections.service";

export const useVotes = (id: string | string[] | undefined) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [electionStatus, setElectionStatus] = useState("");
  const [votedCandidate, setVotedCandidate] = useState<any>(null);

  const checkVoteStatus = async () => {
    try {
      if (id) {
        const status = await votesService.checkVoteStatus(Number(id));
        setHasVoted(status.hasVoted);
        setElectionStatus(status.electionStatus);
        setVotedCandidate(status.candidateId);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái vote:", error);
    }
  };

  const fetchCandidateResults = async () => {
    try {
      if (id) {
        setLoading(true);
        const results = await electionsService.getElectionResults(Number(id));
        setCandidates(results);
      }
    } catch (error) {
      console.error("Lỗi khi lấy kết quả bình chọn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          await Promise.all([fetchCandidateResults(), checkVoteStatus()]);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleVote = async (candidateId: number) => {
    if (!id || voting) return;

    try {
      setVoting(true);
      await votesService.vote({
        electionId: Number(id),
        candidateId,
      });
      setHasVoted(true);
      await fetchCandidateResults();
    } catch (error) {
      console.error("Lỗi khi bình chọn:", error);
    } finally {
      setVoting(false);
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    candidates,
    loading,
    voting,
    handleVote,
    hasVoted,
    electionStatus,
    votedCandidate,
  };
};
