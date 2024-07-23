import fs from 'node:fs'

fs.rmSync('./src/main.ts')
fs.renameSync('./src/main.ts.bak', './src/main.ts')
