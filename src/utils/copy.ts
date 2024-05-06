import { ElMessage } from 'element-plus'

export const copy = async (text: string, message = '复制成功') => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }
  ElMessage({
    message: message,
    type: 'success'
  })
}
