<template>
  <RouterView v-if="mainStore.config.announce !== ''" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useDark } from '@vueuse/core'

useDark()

import { useMainStore } from '@/stores/mainStore.js'
import { getConfig } from './apis/user/parse.js'
import { onMounted } from 'vue'
import { setLoginState } from './utils/env.js'
const mainStore = useMainStore()
onMounted(async () => {
  const configRes = await getConfig()
  mainStore.config = configRes.data
  setLoginState(configRes.data.have_login ? '1' : '0')
})
</script>

<style scoped></style>
