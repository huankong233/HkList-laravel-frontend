<template>
  <el-dialog v-model="mainStore.config.show_announce" title="公告" width="90%">
    <span v-html="announce"></span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useMainStore } from '@/stores/mainStore.js'
import { computed } from 'vue'
const mainStore = useMainStore()
const announce = computed(() => mainStore.config.announce.replaceAll('[NextLine]', '<br>'))
</script>

<style lang="scss" scoped></style>
