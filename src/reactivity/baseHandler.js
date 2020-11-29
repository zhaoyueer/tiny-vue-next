import { isObject, hasOwm, isEqual } from "../utlis"
import { reactive } from "./reactive"
import { track, trigger } from './effect'
import { TriggerOpTypes, TrackOpTypes } from "./operation"

function createGetter() {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    // console.log('取值：', target, key)

    track(target, TrackOpTypes.GET, key); // 依赖收集
    if (isObject(target)) {
      return reactive(res)
    }

    return res
  }
}

function createSetter() {
  return function set(target, key, value, receiver) {
    console.log('center set', key, value)
    const hasKey = hasOwm(target, key)
    const oldValue = target[key]
    const res = Reflect.set(target, key, value, receiver)

    // 判断修改/增加属性，如果原值和新值相同，不处理
    if (!hasKey) {
      // console.log('属性新增：', target)
      trigger(target, TriggerOpTypes.ADD, key, value) // 触发
    } else if (!isEqual(oldValue, value)) {
      // console.log('属性修改：', target)
      trigger(target, TriggerOpTypes.SET, key, value, target[key])
    }

    return res
  }
}

const get = createGetter()
const set = createSetter()

// 普通对象，数组
export const mutableHandler = {
  get,
  set
}