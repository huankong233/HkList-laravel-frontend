<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useDark } from '@vueuse/core'

useDark()
</script>

<style scoped></style>
