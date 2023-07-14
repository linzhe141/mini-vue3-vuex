import { createStore } from '@/vuex';

export default createStore({
  state: {
    count: 1
  },
  getters: {
    double(state) {
      return state.count * 2;
    }
  },
  mutations: {
    add(state, payload) {
      state.count += payload;
    }
  },
  actions: {
    asyncAdd({ commit }, payload) {
      setTimeout(() => {
        commit('add', 1);
      }, 1000);
    }
  },
  // TODO
  modules: {}
});
