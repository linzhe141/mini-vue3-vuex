import { reactive, inject } from 'vue';
const storeKey = 'store';
function initGetters(getters, state) {
  // 没有原型链的空对象
  const _getters = Object.create(null);
  Object.entries(getters ?? {}).forEach(([key, fn]) => {
    Object.defineProperty(_getters, key, {
      get() {
        return fn(state);
      }
    });
  });
  return _getters;
}
function initMutations(mutations) {
  // 没有原型链的空对象 性能好一点
  const _mutations = Object.create(null);
  Object.entries(mutations).forEach(([key, fn]) => {
    if (!_mutations[key]) {
      _mutations[key] = fn;
    }
  });
  return _mutations;
}
function initActions(actions) {
  // 没有原型链的空对象 性能好一点
  const _actions = Object.create(null);
  Object.entries(actions).forEach(([key, fn]) => {
    if (!_actions[key]) {
      _actions[key] = fn;
    }
  });
  return _actions;
}
class Store {
  constructor(options) {
    //? 为什么还要包装一层 data
    //! 因为要配合replaceState(state):void这个api使用，
    //! 这个api可以直接修改this._state.data = state
    //! 这样才能继续保持响应式
    //! 如果this._state = state
    //! 那么对于上次收集的依赖来说，this._state 是一个新的数据
    //! 和以前的依赖关系，没有任何关系了,自然没有响应式更新了

    this._state = reactive({ data: options.state });
    this.getters = initGetters(options.getters, this.state);
    this._mutations = initMutations(options.mutations);
    this._actions = initActions(options.actions);
  }
  //! 因为用户在 配置action时，一般都是是解构出来使用的
  //! 一般没有通过store.commit使用, 这样this就是undefined，所有需要绑定死store实例
  //! asyncAdd({ commit }, payload) {}
  commit = (type, payload) => {
    if (this._mutations[type]) {
      const mutation = this._mutations[type];
      mutation(this.state, payload);
    }
  };
  dispatch = (type, payload) => {
    if (this._actions[type]) {
      const action = this._actions[type];
      const store = this;
      //! 用户可以像这样解构出来使用 asyncAdd({ commit }, payload) {}
      action(store, payload);
    }
  };
  get state() {
    return this._state.data;
  }
  install(app) {
    // 向根组件提过当前的store实例
    app.provide(storeKey, this);
  }
}

export function createStore(options = {}) {
  return new Store(options);
}
export function useStore() {
  // 注入一个整个应用 (通过 app.provide()) 提供的值。
  // 就是能够在setup中获取到 provide 的 store实例 全局共享store
  return inject(storeKey);
}
