import { TriggerOpTypes } from "./operation";

// 创建响应式的effect
let uid = 0
let activeEffect;
const effectStack = []

function createReactiveEffect(fn, options) {
  const effect =  function reactiveEffect() {
    if (!effectStack.includes(effect)) { // 防止不停更新属性，导致死循环
      try {
        effectStack.push(effect);
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.options = options
  effect.id = uid++
  effect.deps = [] // 依赖哪些属性
  return effect
}

// 写了一个effect。effect会执行。 activeEffect = effect
// 对数据进行取值操作， get(), 取name属性 name = [effect]
// 稍后用户修改了name属性， set(), 通过name 找到当前的effect


export function effect(fn, options = {}) { // watchEfect
  const effect = createReactiveEffect(fn, options)

  if (!options.lazy) {
    effect() // 默认执行
  }
  return effect;
}

// ？：activeEffect 是当前的effect? 执行fn过程中会执行track

const targetMap = new WeakMap() // 用法和Map一致，是弱引用，不会导致内存泄漏
export function track(target, type, key) {
  if(activeEffect == undefined) {
    return // 说明取值的属性，不依赖于effect
  }

  let depsMap = targetMap.get(target) // 根据key来进行取值
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect) // { "{name: 'zf'}": { name: set(effect) } }
    activeEffect.deps.push(dep) // 让effect 记录dep
  }
  // console.log('center track', targetMap)
}

export function trigger(target, type, key) {
  const depsMap = targetMap.get(target) // 获取当前对应的map

  if (!depsMap) {
    return
  }
  // 计算属性要优先于effect执行
  const effects = new Set()
  const computedRunners = new Set()

  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => {
        if (effect.options.computed) {
          computedRunners.add(effect)
        } else {
          effects.add(effect)
        }
      })
    }
  }

  if (key !== null) {
    add(depsMap.get(key))
  }

  if (type === TriggerOpTypes.ADD) { // 对数组新增属性，会触发length对应的依赖，取值的时候会对length属性进行依赖收集
    add(depsMap.get(Array.isArray(target) ? 'length' : ''))
  }

  const run = (effect) => {
    if (effect.options.scheduler) {
      effect.options.scheduler()
    } else {
      effect()
    }
  }

  computedRunners.forEach(run)
  effects.forEach(run)
}