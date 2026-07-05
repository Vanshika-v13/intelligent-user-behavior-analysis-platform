import { useQuery } from '@tanstack/react-query';
import { sharedQueryOptions } from './sharedQueryOptions';
import api from '../../services/api';

/**
 * Fetches the list of all courses from the Learning Platform.
 * Used to populate the Course filter dropdown dynamically.
 * Endpoint: GET /api/courses
 */
export const useCourseList = () => {
  const query = useQuery({
    queryKey: ['courseList'],
    queryFn: async () => {
      const response = await api.get('/courses');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes — courses don't change often
    retry: 2,
  });

  // Backend returns: { success: true, courses: [{_id, title, ...}] } or array directly
  const rawCourses = query.data?.courses || query.data?.data || [];

  const courses = rawCourses.map((c) => ({
    id: c._id || c.id,
    title: c.title || 'Untitled Course',
  }));

  return {
    courses,
    isLoading: query.isLoading,
    error: query.error,
  };
};
