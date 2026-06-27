import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../../services/events/eventService';
import { QUERY_KEYS } from '../../constants/queryKeys';

export function useEvents() {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS.ALL],
    queryFn: eventService.getEvents,
  });
}

export function useEvent(id) {
  return useQuery({
    queryKey: QUERY_KEYS.EVENTS.DETAIL(id),
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
  });
}

export function useEventsBySession(sessionId) {
  return useQuery({
    queryKey: QUERY_KEYS.EVENTS.BY_SESSION(sessionId),
    queryFn: () => eventService.getEventsBySession(sessionId),
    enabled: !!sessionId,
  });
}

export function useEventsByUser(userId) {
  return useQuery({
    queryKey: QUERY_KEYS.EVENTS.BY_USER(userId),
    queryFn: () => eventService.getEventsByUser(userId),
    enabled: !!userId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS.ALL] });
    },
  });
}
