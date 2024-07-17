import fs from 'node:fs'

// 移除 main.ts 中的导入css
const mainTs = fs
  .readFileSync('./src/main.ts', { encoding: 'utf8' })
  .replace(`import 'element-plus/dist/index.css'`, '')
  .replace(`import 'element-plus/theme-chalk/dark/css-vars.css'`, '')

fs.copyFileSync('./src/main.ts', './src/main.ts.bak')

fs.writeFileSync('./src/main.ts', mainTs)
