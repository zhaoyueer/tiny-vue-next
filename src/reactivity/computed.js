import { isFunction } from "../utlis";
import { effect, track, trigger } from "./effect";
import { TriggerOpTypes, TrackOpTypes } from "./operation";

export function computed (getterOrOptions) {
  let getter;
  let setter;

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = () => {}
  } else {
    // 考虑下没有值的情况
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  let dirty = true // 缓存。默认第一次取值是执行getter方法的

  let computed
  // 计算属性也是一个effect
  let runner = effect(getter, {
    lazy: true, // 懒加载
    computed: true, //  这里仅仅是标示而已， 是一个计算属性
    scheduler: () => {
      if (!dirty) {
        dirty = true // 等会计算属性依赖的值发生变化后，就会执行
        trigger(computed, TriggerOpTypes.SET, 'value')
      }
    }
  })

  let result
  computed = {
    get value() {
      if (dirty) { // 多次取值 不会重新执行effect
        result = runner()
        dirty = false
        track(computed, TrackOpTypes.GET, 'value')
      }
      return result
    },
    set value(newValue) {
      setter(newValue)
    }
  }

  return computed
}