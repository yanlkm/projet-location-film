import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null, 
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user);
    },
  },
  getters: {
    getUser: state => state.user,
    getUserRole: state => state.user ? state.user.role : null
  },
});
