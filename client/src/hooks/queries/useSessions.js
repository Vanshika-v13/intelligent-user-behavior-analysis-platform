import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../../services/sessions/sessionService';
import { QUERY_KEYS } from '../../constants/queryKeys';

export function useSession(id) {
  return useQuery({
    queryKey: QUERY_KEYS.SESSIONS.DETAIL(id),
    queryFn: () => sessionService.getSession(id),
    enabled: !!id,
  });
}

export function useStartSession() {
  return useMutation({
    mutationFn: sessionService.startSession,
  });
}

export function useEndSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sessionService.endSession,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.DETAIL(sessionId) });
    },
  });
}
