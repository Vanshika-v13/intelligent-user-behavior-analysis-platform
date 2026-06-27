import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/users/userService';
import { QUERY_KEYS } from '../../constants/queryKeys';

export function useUsers() {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS.ALL],
    queryFn: userService.getUsers,
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.DETAIL(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
}
