# vue-next [![CircleCI](https://circleci.com/gh/vuejs/vue-next.svg?style=svg&circle-token=fb883a2d0a73df46e80b2e79fd430959d8f2b488)](https://circleci.com/gh/vuejs/vue-next)

## Status: Pre-Alpha.
学习Vue3.0源码
## packges/reactivity 学习
- reactive.ts 主要通过Proxy对原始对象进行代理，从而实现响应式数据

 主要向外暴露reactive()方法,对原始对象进行代理,内部对只读数据
 提供 redonly()代理方法,对createReactiveObject()传入的参数进行区分createReactiveObject()方法是实现数据代理的方法
- effect.ts 主要是监听函数
- computed.ts 主要是计算属性相关的源码
- ref.ts 主要作用是提供一套Ref类型, 目前暂时忽略
- baseHandlers.ts和collectionHandlers.ts主要是Proxy代理的set和get实现

  在createReactiveObject()中通过判断传入对象的类型来使用baseHandlers或者collectionHandlers,
  其中满足以下类型的使用collectionHandlers
  ```
  const collectionTypes = new Set<Function>([Set, Map, WeakMap, WeakSet])
  ```
  在baseHandlers.ts 中主要使用mutableHandlers 对数据进行设置get和set,包括get,set,deleteProperty, has, ownKeys方法
  ```
    export const mutableHandlers: ProxyHandler<any> = {
      get: createGetter(false),
      set,
      deleteProperty,
      has,
      ownKeys
    }
  ```
  
- operations.ts 是内部数据操作类型的枚举
- lock.ts 是两个控制锁开关变量的方法


## 主要参考文章
- [Vue3 中的数据侦测](https://juejin.im/post/5d99be7c6fb9a04e1e7baa34#heading-0)
- [Vue3响应式系统源码解析-单测篇](https://juejin.im/post/5d9c9a135188252e097569bd#heading-0)
- [Vue3响应式系统源码解析-Ref篇](https://juejin.im/post/5d9eff686fb9a04de04d8367)
- [巧用 TypeScript（五）-- infer](https://juejin.im/post/5c8a518ee51d455e4d719e2e)








