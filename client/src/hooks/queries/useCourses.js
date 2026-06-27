import { useQuery } from '@tanstack/react-query';
import { courseService } from '../../services/courses/courseService';
import { QUERY_KEYS } from '../../constants/queryKeys';

export function useCourses() {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSES.ALL],
    queryFn: courseService.getCourses,
  });
}

export function useCourse(id) {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES.DETAIL(id),
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id,
  });
}
