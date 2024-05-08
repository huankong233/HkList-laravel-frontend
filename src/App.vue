<template>
  <RouterView v-if="mainStore.config.announce !== ''" />
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { RouterView } from 'vue-router'

useDark()

import { useMainStore } from '@/stores/mainStore.js'
import { onMounted } from 'vue'
import * as ParseApi from './apis/user/parse.js'
import { setLoginState } from './utils/env.js'
const mainStore = useMainStore()
onMounted(async () => {
  const configRes = await ParseApi.getConfig()
  mainStore.config = configRes.data
  setLoginState(configRes.data.have_login ? '1' : '0')
})
</script>

<style scoped></style>
