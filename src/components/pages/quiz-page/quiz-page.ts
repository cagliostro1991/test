import vue from 'vue';
import { default as Component } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import Quiz from '../../../interfaces/Quiz';

@Component({
  template: require('./quiz-page.html'),
  components: {
    'app-sidebar' : AppSidebar,
    'dashborad-navigation-block' : DashboradNavigationBlock,
  },
  props: {
    id: [Number, String],
  },
  filters: {
    addSpace(value: any) {
      return value.replace("@", "________________");
    }
  }
})
export class QuizPage extends vue {
  id;

  quizData = {
    id: Number,
    content: [],
    title: String,
  };

  curentQuestion = -1;

  warning = false;
  checkedTrueFalse   = null;
  checkedSingle      = null;
  checkedFillInBlank = null;

  quizProvider = IocContainer.get<Quiz>(SERVICES.QUIZ);

  @Watch('id')
  onPageReload(val: string) {
    this.loadData();
  }

// Functions
  mounted() {
    this.loadData();
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'SET_COURSE' || mutation.type === 'SET_LESSON_PROGRESS') {
        this.setCurentQuestion();
      }
    })
  }

  loadData() {
    this.quizProvider.getQuiz(this.id).then(
      (response) => {
        this.quizData = response.data;
        this.setCurentQuestion();
      },
      (error) => {
        console.error(error);
      },
    );
  }

  setCurentQuestion() {
    if (this.progressIndex === -1) {
      this.curentQuestion = 0;
    }
    if (this.progressIndex >= 0) {
      this.curentQuestion = this.$store.state.progress[this.progressIndex].answers.length;
    }
  }

  calcVariantsLabel(question, question_index, variant) {
    if (this.checkQuestionResult(question, question_index)) {
      if (variant === question.result) {
        return 'currect';
      } else {
        return '';
      }
    } else {
      if (variant === question.result) {
        return 'currect';
      } else {
        if (variant === this.userProgress[this.progressIndex].answers[question_index]) {
          return 'wrong';
        } else {
          return '';
        }
      }
    }
  }

  calcCurrectWrongClass(question, question_index) {
    if (this.checkQuestionResult(question, question_index)) {
      return 'currect';
    } else {
      return 'wrong';
    }
  }

  checkQuestionResult(question, question_index) {
    if (question.type === "single" && question.type === "true-false") {
      return question.variants[question.result] === this.userProgress[this.progressIndex].answers[question_index];
    }
  }

  checkResult() {
    let count  = 0;
    let corect = 0;

    this.quizData.content.forEach((question, question_index) => {
      if (this.checkQuestionResult(question, question_index)) {
        ++corect;
        ++count;
      } else {
        ++count;
      }
    });

    return corect +'/'+ count;
  }

  countPercentage() {
    let count = 0;
    let corect = 0;

    this.quizData.content.forEach((question, question_index) => {
      if (this.checkQuestionResult(question, question_index)) {
        ++corect;
        ++count;
      } else {
        ++count;
      }
    });

    return (corect/count)*100;
  }

  checkedFillInBlankSet(variant) {
    if (this.progressIndex > -1 && this.userProgress[this.progressIndex].answers.includes(variant)) {
        this.warning = true;
      } else {
        this.warning = false;
        this.checkedFillInBlank = variant;
      }
  }

  checkedFillInBlankClass(variant) {
    let classes = [];
    if (this.quizData.content[0].type === 'fill-in-blank') {
      if (this.checkedFillInBlank == variant) {
        classes.push('answer');
      }
      if (this.progressIndex > -1) {
        if (this.userProgress[this.progressIndex].answers.includes(variant)) {
          classes.push('disable-option');
        }
      }
    }
    return classes;
  }

  nextQuestion() {
    const data = { ... this.lessonsData[this.quizIndex] };

    // Record prev progress
    if (this.progressIndex > -1) {
      data.answers = this.userProgress[this.progressIndex].answers;
    } else {
      data.answers = [];
    }

    switch (this.quizData.content[this.curentQuestion].type) {
      case 'true-false':
        if (this.checkedTrueFalse) {
          this.warning = false;
          data.answers[this.curentQuestion] = this.checkedTrueFalse;
          this.checkedTrueFalse = null;
        } else {
          this.warning = true;
        }
        break;

      case 'single':
        if (this.checkedSingle !== null) {
          this.warning = false;
          data.answers[this.curentQuestion] = this.checkedSingle;
          this.checkedSingle = null;
        } else {
          this.warning = true;
        }
        break;

      case 'fill-in-blank':
        if (this.checkedFillInBlank !== null) {
          this.warning = false;
          data.answers[this.curentQuestion] = this.checkedFillInBlank;
          this.checkedFillInBlank = null;
        } else {
          this.warning = true;
        }
        break;
    }

    if (data.answers.length == this.quizData.content.length) {
      data.resultPercentage = this.countPercentage();
      data.result = this.checkResult().split('/');
    }

    this.$store.dispatch('saveLessonProgress', data);
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

// Data
  get lessonsData() {
    return this.$store.state.lessons;
  }

  get userProgress() {
    return this.$store.state.progress;
  }

  get quizFillInBlankVariants() {
    let variants = [];
    if (this.quizData.content[0].type === 'fill-in-blank') {
      this.quizData.content.forEach((question) => {
        question.result.forEach((result) => {
          if (result) {
            variants.push(result);
          }
        });
        question.variants.forEach((variant) => {
          if (variant) {
            variants.push(variant);
          }
        });
      });
    }
    return variants;
  }

// DataIndexes
  get quizIndex() {
    return this.lessonsData.indexOf(this.lessonsData.find((lesson) => {
      return lesson.id === this.quizData.id && lesson.type === 'App\\Models\\Quiz';
    }));
  }

// Logic
  get progressIndex() {
    return this.userProgress.indexOf(this.userProgress.find((lesson) => {
      return lesson.id === this.quizData.id && lesson.type === 'App\\Models\\Quiz';
    }));
  }

  get passPrevious() {
    if (this.quizIndex === 0) {
      return true;
    }
    if (this.quizIndex >= 1) {
      const pastLesson = (this.userProgress[this.quizIndex - 1] !== undefined) ? this.userProgress[this.quizIndex - 1] : false;

      if (pastLesson) {
        return this.userProgress.indexOf(this.userProgress.find((lesson) => {
          return lesson.id === pastLesson.id && lesson.type === pastLesson.type;
        })) > -1;
      }
      return false;
    }
  }

  get wasThere() {
    if (this.lessonsData[this.quizIndex]) {
      return this.lessonsData[this.quizIndex].pass;
    }
  }

  get showResults() {
    return (this.curentQuestion >= this.quizData.content.length);
  }

// Buttons
  get previousButtonIndex() {
    if (this.quizIndex > 0 && this.quizIndex <= this.lessonsData.length - 1) {
      return this.quizIndex - 1;
    }
    return false;
  }

  get previousButtonDisplay() {
    return (this.quizIndex > 0 && this.quizIndex <= this.lessonsData.length - 1) ? true : false;
  }

  get nextButtonIndex() {
    if (this.quizIndex >= 0 && this.quizIndex < this.lessonsData.length - 1) {
      return this.quizIndex + 1;
    }
    return false;
  }

  get nextButtonDisplay() {
    return (this.quizIndex >= 0 && this.quizIndex < this.lessonsData.length - 1) ? true : false;
  }
}
