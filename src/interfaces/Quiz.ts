export default interface Quiz {
  http;
  path;

  getQuizzes();
  getQuiz(quiz: string);
}
