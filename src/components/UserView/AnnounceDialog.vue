<template>
  <el-dialog v-model="needShow" title="公告" width="90%">
    <span v-html="mainStore.config.announce"></span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useMainStore } from '@/stores/mainStore.js'
import { ref, watch } from 'vue'

const mainStore = useMainStore()
const needShow = ref(false)
watch(mainStore.config, (value) => (needShow.value = value.announce !== ''))
</script>

<style lang="scss" scoped></style>
