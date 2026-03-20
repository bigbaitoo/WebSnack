// 示例应用脚本
import { saveToLocalStorage, getFromLocalStorage } from '@shared/utils/storage.js'

// 计数器功能
let count = getFromLocalStorage('demo_counter', 0)
const counterEl = document.getElementById('counter')
const incrementBtn = document.getElementById('incrementBtn')
const saveBtn = document.getElementById('saveBtn')

// 初始化显示
counterEl.textContent = count

// 递增按钮
incrementBtn.addEventListener('click', () => {
  count++
  counterEl.textContent = count
})

// 保存按钮
saveBtn.addEventListener('click', () => {
  saveToLocalStorage('demo_counter', count)
  alert('计数已保存到本地存储！')
})

console.log('示例应用已加载 🎉')
console.log('你可以在 apps/demo/ 目录下修改这个应用')
