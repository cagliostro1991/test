import vue  from 'vue';
import vuex from 'vuex';

import IocContainer from '../container/IocContainer';
import SERVICES     from '../services/SERVICES';

import User   from '../interfaces/User';
import Auth   from '../interfaces/Auth';
import Course from '../interfaces/Course';
import Unit   from '../interfaces/Unit';

const userProvider   = IocContainer.get<User>(SERVICES.USER);
const authProvider   = IocContainer.get<Auth>(SERVICES.AUTH);
const courseProvider = IocContainer.get<Course>(SERVICES.COURSE);
const unitProvider   = IocContainer.get<Unit>(SERVICES.UNIT);

vue.use(vuex);

const store = new vuex.Store({
  strict: true,

  // Inner Data Structure
  state: {
    auth: false,
    user: {
      id: Number,
      name: String,
      email: String,
      role_id: Number,
      avatar: String,
      last_name: String,
      phone: String,
      gender: String,
      birthday: String,
      address: String,
      city: String,
      country: String,
      state: String,
      zip: Number,
    },
    progress: [],
    course_id: null,
    courseTitle: String,
    course: [],
    lessons: [],
    errors: [],
  },

  // Outside communication with data.
  actions: {

    async loadUser({ commit }) {
      if (authProvider.isAuthenticated()) {
        await userProvider.getUser().then(
          (response) => {
            if (response.data.user) {
              commit('SET_USER', response.data.user);
              commit('SET_AUTH', true);
            }
          },
          (error) => {
            console.error(error.response.data.error);
            commit('SET_ERROR', error.response.data.error);
          },
        );
      }
    },

    async loadCourse({ commit, state }) {
      await courseProvider.getCours(state.course_id).then(
        (response) => {
          commit('SET_COURSE', response.data.content);
          commit('SET_COURSE_TITLE', response.data.title);

          response.data.content.forEach((block, i) => {
            block.units.forEach((unit) => {
              unitProvider.getUnit(unit.id).then(
                (response) => {
                  response.data.content.forEach((lesson, j) => {
                    lesson.unitId = unit.id;
                    lesson.order = parseInt(i.toString() + j.toString(), 10);
                    commit('ADD_LESSON', lesson);
                  });
                },
                (error) => {
                  console.error(error.response.data.error);
                  commit('SET_ERROR', error.response.data.error);
                },
              );
            });
          });
        },
        (error) => {
          console.error(error);
        },
      );
    },

    setAuth({ commit }, status) {
      if (status) {
        commit('SET_AUTH', status);
      }
    },

    setUser({ commit }, user) {
      if (user) {
        commit('SET_USER', user);
      }
    },

    setCourse({ commit }, course) {
      if (course) {
        commit('SET_COURSE', course);
      }
    },

    saveLessonProgress({ commit }, lessonId) {
      commit('SET_LESSON_PROGRESS', lessonId);
    },
  },

  // Logic that change data
  mutations: {
    SET_AUTH(state, status) {
      state.auth = status;
    },

    SET_USER(state, user) {
      state.user.id            = (user.id) ? user.id : null;
      state.user.name          = (user.name) ? user.name : '';
      state.user.email         = (user.email) ? user.email : '';
      state.user.role_id       = (user.role_id) ? user.role_id : null;
      state.user.avatar        = (user.avatar) ? user.avatar : '';
      state.user.last_name     = (user.last_name) ? user.last_name : '';
      state.user.phone         = (user.phone) ? user.phone : '';
      state.user.gender        = (user.gender) ? user.gender : '';
      state.user.birthday      = (user.birthday) ? user.birthday : '';
      state.user.address       = (user.address) ? user.address : '';
      state.user.city          = (user.city) ? user.city : '';
      state.user.country       = (user.country) ? user.country : '';
      state.user.state         = (user.state) ? user.state : '';
      state.user.zip           = (user.zip) ? user.zip : null;

      state.progress      = (user.progress_data) ? user.progress_data : [];
      state.course_id     = (user.course_id) ? user.course_id : null;
    },

    SET_COURSE(state, course) {
      state.course = course;
    },

    SET_COURSE_TITLE(state, title) {
      state.courseTitle = title;
    },

    SET_LESSON_PROGRESS(state, lessonId) {
      state.progress.push(lessonId);
      userProvider.setUserProgress(JSON.stringify(state.progress));
    },

    ADD_LESSON(state, lesson) {
      state.lessons.push(lesson);
      state.lessons.sort((a, b) => {
        if (a.order > b.order) {
          return 1;
        }
        if (a.order < b.order) {
          return -1;
        }
        return 0;
      });
    },
  },

  // Get Data
  getters: {
    auth(state) {
      return state.auth;
    },
    user(state) {
      return state.user;
    },
  },

});

export default store;
