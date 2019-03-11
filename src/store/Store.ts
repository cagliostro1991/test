import vue  from 'vue';
import vuex from 'vuex';

import IocContainer from '../container/IocContainer';
import SERVICES     from '../services/SERVICES';

import User from '../interfaces/User';

const userProvider = IocContainer.get<User>(SERVICES.USER);

vue.use(vuex);

const store = new vuex.Store({
  strict: process.env.NODE_ENV === 'development',

  // Inner Data Structure
  state: {
    auth: false,
    user: {
      // id: 1,
      // name: "Name",
      // email: "admin@admin.com",
      // role_id: Number,
      // avatar: "users/default.png",
      // settings: null,
      // last_name: "Name",
      // phone: "23123123",
      // gender: "FEMALE",
      // birthday: "123123123",
      // address: "123123",
      // city: "123123123",
      // country: "US",
      // state: "123123123",
      // zip: Number,
      // progress_data: Array,
      // course_id: Number,
    },
  },

  // Outside communication with data.
  actions: {
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

    // saveLessonProgress({ commit }, lessonId) {
    //   commit('SET_LESSON_PROGRESS', lessonId);
    // },
  },

  // Logic that change data
  mutations: {
    SET_AUTH(state, status) {
      state.auth = status;
    },

    SET_USER(state, user) {
      state.user = user;
    },

    // SET_LESSON_PROGRESS(state, lessonId) {
    //   // state.user.progress = user;
    // },
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
