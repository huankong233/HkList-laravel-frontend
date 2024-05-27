export const registerKeyDown = (key: string, callback: Function) => {
  document.addEventListener('keydown', (event) => {
    if (event.key === key) callback()
  })
}
