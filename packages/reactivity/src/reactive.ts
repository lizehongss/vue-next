import { isObject, toTypeString } from '@vue/shared'
import { mutableHandlers, readonlyHandlers } from './baseHandlers'

import {
  mutableCollectionHandlers,
  readonlyCollectionHandlers
} from './collectionHandlers'

import { UnwrapNestedRefs } from './ref'
import { ReactiveEffect } from './effect'

// The main WeakMap that stores {target -> key -> dep} connections.
// Conceptually, it's easier to think of a dependency as a Dep class
// which maintains a Set of subscribers, but we simply store them as
// raw Sets to reduce memory overhead.\
//存储{target->key->dep}连接的主要漏洞。
//从概念上讲，将依赖项看作维护一组订阅服务器的dep类更容易，但我们只是将它们存储为原始集以减少内存开销。
export type Dep = Set<ReactiveEffect>
export type KeyToDepMap = Map<string | symbol, Dep>
export const targetMap = new WeakMap<any, KeyToDepMap>()

// WeakMaps that store {raw <-> observed} pairs.
// 保存原始数据  可查代理数据
const rawToReactive = new WeakMap<any, any>()
// 保存可响应数据 可查原始数据
const reactiveToRaw = new WeakMap<any, any>()
// 保存只读原始数据 可查代理数据
const rawToReadonly = new WeakMap<any, any>()
// 保存只读可响应数据 可查原始数据
const readonlyToRaw = new WeakMap<any, any>()

// WeakSets for values that are marked readonly or non-reactive during
// observable creation.
// weakset用于在可观察创建期间标记为只读或非响应的值
const readonlyValues = new WeakSet<any>()
const nonReactiveValues = new WeakSet<any>()

const collectionTypes = new Set<Function>([Set, Map, WeakMap, WeakSet])
const observableValueRE = /^\[object (?:Object|Array|Map|Set|WeakMap|WeakSet)\]$/

const canObserve = (value: any): boolean => {
  return (
    !value._isVue &&
    !value._isVNode &&
    observableValueRE.test(toTypeString(value)) &&
    !nonReactiveValues.has(value)
  )
}

export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  // 对象是只读的，返回只读
  if (readonlyToRaw.has(target)) {
    return target
  }
  // target is explicitly marked as readonly by user
  // 目标被用户显式标记为只读
  if (readonlyValues.has(target)) {
    return readonly(target)
  }
  return createReactiveObject(
    target, // 目标数据
    rawToReactive, // 原始数据->代理数 弱键值对
    reactiveToRaw, // 代理数据 -> 原始数据 弱键值对
    mutableHandlers,
    mutableCollectionHandlers
  )
}

export function readonly<T extends object>(
  target: T
): Readonly<UnwrapNestedRefs<T>> {
  // value is a mutable observable, retrieve its original and return
  // a readonly version.
  // //value是一个可变的可观察值，检索其原始值并返回只读版本
  if (reactiveToRaw.has(target)) {
    target = reactiveToRaw.get(target)
  }
  return createReactiveObject(
    target,
    rawToReadonly,
    readonlyToRaw,
    readonlyHandlers,
    readonlyCollectionHandlers
  )
}

function createReactiveObject(
  target: any,
  toProxy: WeakMap<any, any>,
  toRaw: WeakMap<any, any>,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  // 只可代理对象
  if (!isObject(target)) {
    // 开发环境报错
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target already has corresponding Proxy
  // 目标已具有相应的代理返回，可理解为已经代理
  // 原始数据已经有对应的代理数据, 返回
  let observed = toProxy.get(target)
  if (observed !== void 0) {
    return observed
  }
  // target is already a Proxy
  // 目标已是代理, 目标是代理的数据 返回
  if (toRaw.has(target)) {
    return target
  }
  // only a whitelist of value types can be observed.
  // 只能观察到值类型的白名单， 暂时忽略
  if (!canObserve(target)) {
    return target
  }
  // 判断传入对象的类型, 使用collectionHandlers 或者 baseHandlers 劫持代理数据的get 和 set
  const handlers = collectionTypes.has(target.constructor)
    ? collectionHandlers
    : baseHandlers
  observed = new Proxy(target, handlers)
  // 将代理数据和原始数据保存为键值对, 可互相索引
  toProxy.set(target, observed)
  toRaw.set(observed, target)
  // targetMap作用暂时未知
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map())
  }
  return observed
}

export function isReactive(value: any): boolean {
  return reactiveToRaw.has(value) || readonlyToRaw.has(value)
}

export function isReadonly(value: any): boolean {
  return readonlyToRaw.has(value)
}
//使用泛型类型
export function toRaw<T>(observed: T): T {
  return reactiveToRaw.get(observed) || readonlyToRaw.get(observed) || observed
}

//使数据只读
export function markReadonly<T>(value: T): T {
  readonlyValues.add(value)
  return value
}

//使数据不响应
export function markNonReactive<T>(value: T): T {
  nonReactiveValues.add(value)
  return value
}
