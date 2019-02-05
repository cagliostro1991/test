import vue  from 'vue';
import vuex from 'vuex';

import { default as _ } from 'lodash';

import IocContainer from '../container/IocContainer';
import services  from '../services/services';

vue.use(vuex);

const store = new vuex.Store({
  // strict: process.env.NODE_ENV === 'development',

  // Inner Data Structure
  state: {
    auth: false,
  },

  // Outside communication with data.
  actions: {
    setAuth({ commit }, status) {
      if (status) {
        commit('SET_AUTH', status);
      }
    },
  },

  // Logic that change data
  mutations: {
    SET_AUTH(state, status) {
      state.auth = status;
    },
  },

  // Get Data
  getters: {
    auth(state) {
      return state.auth;
    },
  },

});

export default store;
