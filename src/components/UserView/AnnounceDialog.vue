<template>
  <el-dialog v-model="mainStore.config.announce" title="公告" width="90%">
    <span v-html="mainStore.config.announce"></span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useMainStore } from '@/stores/mainStore.js'
const mainStore = useMainStore()
</script>

<style lang="scss" scoped></style>
