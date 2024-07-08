<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/mainStore.js'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import * as ParseApi from './apis/user/parse.js'
import { getRemberAnnounce, setLoginState } from './utils/env.js'
const mainStore = useMainStore()

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

onMounted(async () => {
  // 小彩蛋
  console.info(
    `%c
 █████╗   ██╗  ██╗  ██╗       ██╗  ███████╗  ████████╗          ██╗        █████╗   ██████╗    █████╗   ██╗   ██╗  ███████╗  ██╗     
██╔══██╗  ██║  ██║  ██║       ██║  ██╔════╝  ╚══██╔══╝          ██║       ██╔══██╗  ██╔══██╗  ██╔══██╗  ██║   ██║  ██╔════╝  ██║     
╚██████║  ███████║  ██║       ██║  ███████╗     ██║     █████╗  ██║       ███████║  ██████╔╝  ███████║  ██║   ██║  █████╗    ██║     
 ╚═══██║  ╚════██║  ██║       ██║  ╚════██║     ██║     ╚════╝  ██║       ██╔══██║  ██╔══██╗  ██╔══██║  ╚██╗ ██╔╝  ██╔══╝    ██║     
 █████╔╝       ██║  ███████╗  ██║  ███████║     ██║             ███████╗  ██║  ██║  ██║  ██║  ██║  ██║   ╚████╔╝   ███████╗  ███████╗
 ╚════╝        ╚═╝  ╚══════╝  ╚═╝  ╚══════╝     ╚═╝             ╚══════╝  ╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚═╝    ╚═══╝    ╚══════╝  ╚══════╝ `,
    `font-family: courier; background: linear-gradient(to right, ${getRandomColor()}, ${getRandomColor()});-webkit-background-clip: text;color: transparent;`
  )

  const match = window.matchMedia('(prefers-color-scheme: dark)')
  useDark(match)
  match.addEventListener('change', useDark)
  function useDark(event: MediaQueryList | MediaQueryListEvent) {
    if (event.matches) {
      document.querySelector('html')!.classList.add('dark')
    } else {
      document.querySelector('html')!.classList.remove('dark')
    }
  }

  const configRes = await ParseApi.getConfig()
  const data = configRes.data

  data.announce = data.announce.replaceAll('[NextLine]', '<br>')
  if (data.announce === getRemberAnnounce()) data.show_announce = false

  mainStore.config = {
    ...data,
    is_https: document.location.protocol === 'https:'
  }

  setLoginState(data.have_login ? '1' : '0')
})
</script>

<style scoped></style>
