<template>
  <announceDialog />
  <getFileListForm />
  <showFileList />
  <downloadDialog />
  <aria2ConfigDialog />
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const announceDialog = defineAsyncComponent(
  () => import('@/components/UserPannel/announceDialog.vue')
)

const getFileListForm = defineAsyncComponent(
  () => import('@/components/UserPannel/getFileListForm.vue')
)
const showFileList = defineAsyncComponent(() => import('@/components/UserPannel/showFileList.vue'))

const downloadDialog = defineAsyncComponent(
  () => import('@/components/UserPannel/downloadDialog.vue')
)
const aria2ConfigDialog = defineAsyncComponent(
  () => import('@/components/UserPannel/aria2ConfigDialog.vue')
)
import { useUserPannelStore } from '@/store/UserPannel.js'
import { onMounted } from 'vue'

const userPannelStore = useUserPannelStore()
onMounted(userPannelStore.getConfig)
</script>

<style lang="scss">
.card,
.table,
.form,
.alert {
  margin-top: 15px !important;
}

img {
  width: 20px;
  height: 20px;
}
</style>
