import vue from 'vue';
import { default as Component } from 'vue-class-component';
import { Watch }                from 'vue-property-decorator';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import Lesson from '../../../interfaces/Lesson';

@Component({
  template: require('./lesson-page.html'),
  components: {
    'app-sidebar' : AppSidebar,
    'dashborad-navigation-block' : DashboradNavigationBlock,
  },
  props: {
    id: [Number, String],
  },
})
export class LessonPage extends vue {
  id;

  lessonData = {
    id: Number,
    body: String,
    status: String,
    title: String,
  };

  lessonProvider = IocContainer.get<Lesson>(SERVICES.LESSON);

  mounted() {
    this.loadData();
  }

  @Watch('id')
  onPageReload(val: string) {
    this.loadData();
  }

  // Data
  get lessonsData() {
    return this.$store.state.lessons;
  }

  get userProgress() {
    return this.$store.state.progress;
  }

  // DataIndexes
  get lessonIndex() {
    return this.lessonsData.indexOf(this.lessonsData.find((lesson) => {
      return lesson.id === this.lessonData.id && lesson.type === 'App\\Models\\Lesson';
    }));
  }

  // Titles
  get courseTitle() {
    return this.$store.state.courseTitle;
  }

  get blockTitle() {
    if (this.lessonsData[this.lessonIndex]) {
      return this.$store.state.course.find((course) => {
        return course.units.find((unit) => {
          return (unit.id == this.lessonsData[this.lessonIndex].unitId);
        })
      }).title;
    }
  }

  get unitTitle() {
    if (this.lessonsData[this.lessonIndex]) {
      let units = this.$store.state.course.find((course) => {
        return course.units.find((unit) => {
          return (unit.id == this.lessonsData[this.lessonIndex].unitId);
        })
      });
      return units.units.find((unit) => {
        return (unit.id == this.lessonsData[this.lessonIndex].unitId);
      }).title;
    }
  }

  // Buttons
  get previousButtonIndex() {
    if (this.lessonIndex > 0 && this.lessonIndex <= this.lessonsData.length - 1) {
      return this.lessonIndex - 1;
    }
    return false;
  }

  get previousButtonDisplay() {
    return (this.lessonIndex > 0 && this.lessonIndex <= this.lessonsData.length - 1) ? true : false;
  }

  get nextButtonIndex() {
    if (this.lessonIndex >= 0 && this.lessonIndex < this.lessonsData.length - 1) {
      return this.lessonIndex + 1;
    }
    return  false;
  }

  get nextButtonDisplay() {
    return (this.lessonIndex >= 0 && this.lessonIndex < this.lessonsData.length - 1) ? true : false;
  }

  // Logic
  get wasThere() {
    if (this.lessonsData[this.lessonIndex]) {
      return this.lessonsData[this.lessonIndex].pass;
    }
  }

  get passPrevious() {
    if (this.lessonIndex === 0) {
      return true;
    }
    if (this.lessonIndex >= 1) {
      const pastLesson = (this.userProgress[this.lessonIndex - 1] !== undefined) ? this.userProgress[this.lessonIndex - 1] : false;

      if (pastLesson) {
        return this.userProgress.indexOf(this.userProgress.find((lesson) => {
          return lesson.id === pastLesson.id && lesson.type === pastLesson.type;
        })) > -1;
      }
      return false;
    }
  }


  // Functions
  loadData() {
    this.lessonProvider.getLesson(this.id).then(
      (response) => {
        this.lessonData = response.data;
      },
      (error) => {
        console.error(error);
      },
    );
  }

  saveAndContinue() {
    this.$store.dispatch('saveLessonProgress', this.lessonsData[this.lessonIndex]);

    if (this.isLesson(this.nextButtonIndex)) {
      this.$router.push({
        name: 'lesson',
        params: {
          id: this.lessonsData[this.nextButtonIndex].id,
        },
      });
    }

    if (this.isQuiz(this.nextButtonIndex)) {
      this.$router.push({
        name: 'quiz',
        params: {
          id: this.lessonsData[this.nextButtonIndex].id,
        },
      });
    }
  }

  isLesson(buttonIndex) {
    if (this.lessonsData[buttonIndex]) {
      return (this.lessonsData[buttonIndex].type === 'App\\Models\\Lesson') ? true : false;
    }
  }

  isQuiz(buttonIndex) {
    if (this.lessonsData[buttonIndex]) {
      return (this.lessonsData[buttonIndex].type === 'App\\Models\\Quiz') ? true : false;
    }
  }
}
