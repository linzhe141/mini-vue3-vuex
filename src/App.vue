<template>
  <!-- <div>count：{{ count }}</div> -->
  <div>double getters：{{ double }}</div>
  <div><button @click="add">mutation commit + 1</button></div>
  <div><button @click="asyncAdd">action dispatch + 1</button></div>
</template>

<script>
import { useStore } from '@/vuex';
import { computed } from 'vue';
export default {
  name: 'App',
  setup() {
    const store = useStore();

    const add = () => {
      store.commit('add', 1);
    };
    const asyncAdd = () => {
      store.dispatch('asyncAdd', 1);
    };
    return {
      //? 为什么要加 computed
      // 如果不加computed => count: store.state.count => count:1,
      // 在模板(也就是渲染函数中)，这个count就是写死的1，不会进行依赖收集, 做不到响应式更新

      // 加了commputed => count: computed(() => store.state.count),
      // 在模板中，这个是一个计算属性，第一次默认就会执行，
      // 在执行这个computed的时候，因为state是一个响应式数据，所以在取值count时，会进行依赖收集（computed的getter）
      // 会进行依赖收集,并且对应computed来说，也会track(this:计算属性, 'value')依赖收集（模板的渲染函数）
      // 所以说，当count改变的时候，会一次触发 computed的getter 和 模板的渲染函数
      count: computed(() => store.state.count),
      double: computed(() => store.getters.double),
      add,
      asyncAdd
    };
  }
};
</script>
