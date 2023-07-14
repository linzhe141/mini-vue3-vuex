# 实现`Vue3`简易版的`Vuex`插件

这是 Vue3 简易版 Vuex 的实现，包含如下功能：

- createStore
- getters
- mutations
- actions
- useStore

### TODO

- modules 模块化

### 大致原理：

- 就是根据用户传入的 state 和其他改变 state 的方法的 options 对象创建一个 store
- 利用 reactive 创建响应式数据 `this._state = reactive({ data: options.state })`;
- 并将这个 store 挂载到 app 根组件上，子组件通过 useStore() 进行注入，从而拿到全局的 store
- 其他组件用到这个 store 的 state 时，就会进行依赖收集，当 commit 改变状态后，那么对应的依赖就会自动执行了，从而做到视图更新
