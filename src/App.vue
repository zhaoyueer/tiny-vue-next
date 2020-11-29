<template>
  <div @click="handleClick">
    <circle :data="state.data" :x="state.x" :y="400" :r="200"></circle>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  name: 'App',
  // composition Api 入口
  setup() {
    const state = reactive({
      data: [
        {
          name: '语文',
          count: 100,
          color: 'red'
        },
        {
          name: '数学',
          count: 200,
          color: 'yellow'
        },
        {
          name: '物理',
          count: 300,
          color: 'pink'
        },
        {
          name: '化学',
          count: 400,
          color: 'green'
        }
      ],
      x: 300
    })

    function handleClick () {
      state.data.push({ name: '英语', count: 400, color: 'blue' })
      // state.x = 500 // 异步更新，数据变化后 立即渲染拿到的是老数据 nextTick
    }

    return { handleClick, state }
  }
}
</script>

<style>
</style>
