import { useEffect, useState, useCallback } from 'react';
import { fetchElections } from '../api/services/electionList.service';

export type Election = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
};

export const useElectionList = () => {
  const [Elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadElections = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchElections();
      setElections(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadElections();
  }, [loadElections]);

  return { Elections, loading, error, refetch: loadElections };
};
