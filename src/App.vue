<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/mainStore.js'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import * as ParseApi from './apis/user/parse.js'
import { setLoginState } from './utils/env.js'
const mainStore = useMainStore()

onMounted(async () => {
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
  mainStore.config = {
    ...configRes.data,
    is_https: document.location.protocol === 'https:'
  }
  setLoginState(configRes.data.have_login ? '1' : '0')
})
</script>

<style scoped></style>
