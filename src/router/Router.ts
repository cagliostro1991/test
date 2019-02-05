import vue       from 'vue';
import vueRouter from 'vue-router';
import Guard     from './Guard';

vue.use(vueRouter);

// Page components
import { CertificateApplication } from '../components/pages/certificate-application';
import { ChangePassword }         from '../components/pages/change-password';
import { CoursePage }             from '../components/pages/course-page';
import { LessonPage }             from '../components/pages/lesson-page';
import { ExtendCource }           from '../components/pages/extend-cource';
import { LibraryPage }            from '../components/pages/library-page';
import { MarksPage }              from '../components/pages/marks-page';
import { ProfilePage }            from '../components/pages/profile-page';
import { QuizPage }               from '../components/pages/quiz-page';
import { PageNotFound }           from '../components/pages/page-not-found';

export default new vueRouter({
  mode: 'history',
  base: process.env.PATH_BASE,
  routes: [
    {
      path: '/',
      name: 'course',
      component: CoursePage,
      beforeEnter: Guard.auth,
    },
    {
      path: '/lesson',
      name: 'lesson',
      component: LessonPage,
      beforeEnter: Guard.auth,
    },
    {
      path: '/extend-cource',
      name: 'cource.extend',
      component: ExtendCource,
      beforeEnter: Guard.auth,
    },
    {
      path: '/certificate-application',
      name: 'certificate',
      component: CertificateApplication,
      beforeEnter: Guard.auth,
    },
    {
      path: '/profile',
      name: 'user.profile',
      component: ProfilePage,
      beforeEnter: Guard.auth,
    },
    {
      path: '/change-password',
      name: 'user.change.password',
      component: ChangePassword,
      beforeEnter: Guard.auth,
    },
    {
      path: '/library',
      name: 'library',
      component: LibraryPage,
      beforeEnter: Guard.auth,
    },
    {
      path: '/marks',
      name: 'marks',
      component: MarksPage,
      beforeEnter: Guard.auth,
    },

    {
      path: '/quiz',
      name: 'quiz',
      component: QuizPage,
      beforeEnter: Guard.auth,
    },

    // 404 - should be last
    { path: '*', name: '404', component: PageNotFound },
  ],
});
