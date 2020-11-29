// import { createApp } from 'vue';  // 高阶函数的使用 内部会自动传入dom操作的方法
import { createRenderer, nextTick } from '@vue/runtime-dom' // 拿到创建渲染器的方法
import App from './App.vue'

// 原生vue3 中可以直接创建应用，希望变成小程序
// vue3 底层还是操作dome元素，setData()
// createApp(App).mount('#app')

let canvas
let ctx

const d2a = (n) => {
  return n * Math.PI / 180
}

const drawCircle = (start, end, color, cx, cy, r) => {
  // Math.cos sin 都是基于弧度来计算的
  // 将角度转化为弧度

  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.arc(cx, cy, r, d2a(start), d2a(end))

  ctx.fillStyle = color;
  ctx.fill()

  ctx.stroke() // 线条方式展示

  ctx.closePath()
}

const draw = (el, noClear) => {
  if (!noClear) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // 要识别哪些需要渲染
  if (el.tag === 'circle') {
    // 这里要画个圆
    let { data, x, y, r } = el;

    const total = data.reduce((memo, current) => memo + current.count, 0)

    // 一共360度，每个占多少
    let start = 0
    let end = 0

    data.forEach(item => {
      end += item.count / total * 360
      drawCircle(start, end, item.color, x, y, r)
      start = end
    })

  }
  // 渲染儿子
  el.childs && el.childs.forEach(element => {
    draw(element, true)
  })
}


const ops = { // 这里增加渲染逻辑
  insert: (child, parent, anchor) => {
    // 插入的过程是由子及父 circle 插入到div中，div插入到canvas中
    // console.log('center insert', child, parent)

    // 插入时，先创建父子关系
    child.parent = parent
    if (!parent.childs) {
      parent.childs = [child]
    } else {
      parent.childs.push(child)
    }

    // 遇到canvas需要将整棵渲染到canvas中
    if (parent.nodeType === 1) {
      draw(child);

      if (child.onClick) {
        canvas.addEventListener('click', () => {
          child.onClick() // 触发定义的事件
          nextTick(() => {
            draw(child) // 重新绘制canvas
          })
        })
      }
    }
  },

  remove: child => {},

  createElement: (tag, isSVG, is) => {
    // 创建元素的过程 是深度遍历的过程
    // console.log('center create', tag)
    return { tag }
  },

  createText: text => {},

  createComment: text => {},

  setText: (node, text) => {},

  setElementText: (el, text) => {},

  parentNode: node => {},

  nextSibling: node => {},

  querySelector: selector => {},

  setScopeId(el, id) {},

  cloneNode(el) {},

  insertStaticContent(content, parent, anchor, isSVG) {},

  // 控制属性
  patchProp(el, key, prevValue, nextValue) {
    el[key] = nextValue // 给自己自定义的对象添加的属性
  }
}

const createCanvasApp = (...args) => {
  // 这里创建渲染器时,传入底层你想操作的方法
  const app = createRenderer(ops).createApp(...args)

  const { mount } = app // 内部的mount方法
  app.mount = (selector) => {
    let el = document.querySelector(selector)
    // 实现canvas 需有canvas画布
    canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    el.appendChild(canvas)
    ctx = canvas.getContext('2d')
    mount(el)
  }
  return app
}

createCanvasApp(App).mount('#app')
