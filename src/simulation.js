// import { reactive, effect } from '@vue/reactivity'
import { reactive, effect, computed } from './reactivity'

// proxy 代理
const state = reactive({ name: 'zy', age: 11, arr: [1, 2, 3] })

// 调用push 方法时，先向数组中插入，随后会继续修改数组长度
// state.arr.push(4)

// effect(() => {
//   // ?: JSON
//   console.log(JSON.stringify(state.arr))
//   console.log(state.arr)
// })
// state.arr[0] = 100

// effect(() => {
//   state.age = 20
// })

// lazy 为true的effect
// 只传函数是get方法，传对象时{ get: {}, set: {} }
let myAge = computed(() => {
  console.log('ik')
  return state.age * 2
})

effect(() => {
  console.log(myAge.value)
})
// myAge.value
// myAge.value
state.age = 100