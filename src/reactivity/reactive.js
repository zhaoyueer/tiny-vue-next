import { isObject } from "../utlis"
import { mutableHandler } from './baseHandler'

function createReactiveObject(target, baseHandler) {
  if (!isObject(target)) {
    return target
  }

  const observed = new Proxy(target, baseHandler)
  return observed
}

export function reactive(target) {
  // 创建一个响应式的对象（对象，数组，Set，Map）
  return createReactiveObject(target, mutableHandler)
}