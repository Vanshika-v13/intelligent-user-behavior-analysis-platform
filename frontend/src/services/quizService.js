import api from './api';

export const getQuizForCourse = async (courseId) => {
  const response = await api.get(`/quizzes/course/${courseId}`);
  return response.data;
};

export const submitQuiz = async (courseId, answers) => {
  const response = await api.post(`/quizzes/submit/${courseId}`, { answers });
  return response.data;
};

export const getCourseQuizResult = async (courseId) => {
  const response = await api.get(`/quizzes/result/${courseId}`);
  return response.data;
};

export const getMyQuizAttempts = async () => {
  const response = await api.get('/quizzes/my-attempts');
  return response.data;
};

export const getAttemptById = async (attemptId) => {
  const response = await api.get(`/quizzes/attempt/${attemptId}`);
  return response.data;
};
