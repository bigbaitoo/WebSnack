/**
 * 本地存储工具函数
 * 封装 localStorage 操作，支持 JSON 序列化/反序列化
 */

/**
 * 保存数据到 localStorage
 * @param {string} key 存储键名
 * @param {any} value 要存储的值
 * @param {number} expire 过期时间（毫秒），可选
 */
export function saveToLocalStorage(key, value, expire = null) {
  try {
    const data = {
      value,
      timestamp: Date.now(),
      expire,
    }
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('保存到 localStorage 失败:', error)
    return false
  }
}

/**
 * 从 localStorage 获取数据
 * @param {string} key 存储键名
 * @param {any} defaultValue 默认值
 * @returns {any} 存储的值
 */
export function getFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue

    const data = JSON.parse(item)

    // 检查是否过期
    if (data.expire && Date.now() - data.timestamp > data.expire) {
      localStorage.removeItem(key)
      return defaultValue
    }

    return data.value
  } catch (error) {
    console.error('从 localStorage 获取数据失败:', error)
    return defaultValue
  }
}

/**
 * 从 localStorage 删除数据
 * @param {string} key 存储键名
 */
export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('从 localStorage 删除数据失败:', error)
    return false
  }
}

/**
 * 清空所有 localStorage 数据
 */
export function clearLocalStorage() {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error('清空 localStorage 失败:', error)
    return false
  }
}
