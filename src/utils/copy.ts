import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'

export const copy = (text: string, message: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  new Clipboard(textarea, {
    text: () => text
  })
  textarea.click()
  document.body.removeChild(textarea)

  if (message) {
    ElMessage({
      message: message,
      type: 'success'
    })
  }
}
