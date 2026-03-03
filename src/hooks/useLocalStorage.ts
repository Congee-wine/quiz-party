import { ref, watch } from 'vue'

/**
 * useLocalStorage Hook
 *
 * 用途：封装 localStorage 的读写操作，提供响应式的数据管理
 *
 * @param key - localStorage 的键名
 * @param defaultValue - 默认值（当 localStorage 中没有数据时使用）
 * @returns 响应式的数据和操作方法
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  // 第一步：创建响应式数据
  const data = ref<T>(defaultValue)

  // 第二步：从 localStorage 读取数据
  const readFromStorage = () => {
    try {
      const item = localStorage.getItem(key)

      if (item !== null) {
        data.value = JSON.parse(item) as T
      }
    } catch (error) {
      console.error(`读取 localStorage 失败 (key: ${key}):`, error)
      data.value = defaultValue
    }
  }

  // 第三步：保存数据到 localStorage
  const writeToStorage = (value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`保存到 localStorage 失败 (key: ${key}):`, error)
    }
  }

  // 🆕 第四步：删除数据
  /**
   * 从 localStorage 中删除数据，并将值重置为默认值
   *
   * 使用场景：
   * - 用户退出登录，清除用户信息
   * - 清空购物车
   */
  const remove = () => {
    try {
      // 从 localStorage 删除
      localStorage.removeItem(key)
      // 重置为默认值
      data.value = defaultValue
    } catch (error) {
      console.error(`删除 localStorage 失败 (key: ${key}):`, error)
    }
  }

  // 🆕 第五步：重置为默认值
  /**
   * 将数据重置为默认值，并保存到 localStorage
   *
   * 与 remove() 的区别：
   * - remove(): 删除 localStorage 中的数据，值变为默认值
   * - reset(): 保留 localStorage 中的数据，但值变为默认值
   *
   * 使用场景：
   * - 重置表单
   * - 清空排行榜但保留记录
   */
  const reset = () => {
    data.value = defaultValue
    // 注意：这里会触发 watch，自动保存到 localStorage
  }

  // 🆕 第六步：手动设置值
  /**
   * 手动设置值并保存到 localStorage
   *
   * 为什么需要这个方法？
   * - 有时候直接修改 data.value 不够直观
   * - 提供更明确的 API
   *
   * 使用场景：
   * - setValue(newValue) 比 data.value = newValue 更清晰
   */
  const setValue = (value: T) => {
    data.value = value
    // 注意：这里会触发 watch，自动保存到 localStorage
  }

  // 初始化时读取数据
  readFromStorage()

  // 监听数据变化，自动保存
  watch(
    data,
    (newValue) => {
      writeToStorage(newValue)
    },
    { deep: true },
  )

  // 返回数据和所有操作方法
  return {
    data, // 响应式数据
    setValue, // 手动设置值
    remove, // 删除数据
    reset, // 重置为默认值
  }
}
