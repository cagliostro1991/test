import vue       from 'vue';
import { default as Component } from 'vue-class-component';

@Component({
  template: require('./app-sidebar.html'),
})
export class AppSidebar extends vue {

  get lessonsData() {
    return this.$store.state.lessons;
  }

  get userData() {
    return this.$store.state.user;
  }

  get userProgress() {
    return this.$store.state.progress[this.$store.state.progress.length - 1];
  }

  get lessonLastPassIndex() {
    if (this.userProgress) {
      return this.lessonsData.map((lesson) => {
        return lesson.id;
      }).indexOf(this.userProgress.id);
    }
  }

  get nextLesson() {
    if (this.lessonLastPassIndex + 1 <= this.lessonsData.length) {
      return this.lessonsData[this.lessonLastPassIndex + 1];
    }
    return false;
  }

  isLesson(lesson) {
    if (lesson) {
      return (lesson.type === 'App\\Models\\Lesson') ? true : false;
    }
  }

  isQuiz(lesson) {
    if (lesson) {
      return (lesson.type === 'App\\Models\\Quiz') ? true : false;
    }
  }
}
