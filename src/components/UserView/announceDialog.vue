<template>
  <el-dialog v-model="clientConfig.announceSwitch" title="公告" width="90%">
    <span v-html="clientConfig.announce"></span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useUserPannelStore } from '@/store/UserPannel.js'
import { storeToRefs } from 'pinia'

const userPannelStore = useUserPannelStore()
const { clientConfig } = storeToRefs(userPannelStore)
</script>

<style lang="scss" scoped></style>
