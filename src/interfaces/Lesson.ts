export default interface Lesson {
  http;
  path;

  getLessons();
  getLesson(lesson: string);
}
