<template>
  <div class="container">
    <AnnounceDialog />
    <Aria2Dialog />

    <GetFileList />
    <ShowFileList />
    <DownloadLinks />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const AnnounceDialog = defineAsyncComponent(
  () => import('@/components/UserView/AnnounceDialog.vue')
)
const GetFileList = defineAsyncComponent(() => import('@/components/UserView/GetFileList.vue'))
const ShowFileList = defineAsyncComponent(() => import('@/components/UserView/ShowFileList.vue'))
const DownloadLinks = defineAsyncComponent(() => import('@/components/UserView/DownloadLinks.vue'))
const Aria2Dialog = defineAsyncComponent(() => import('@/components/UserView/Aria2Dialog.vue'))
</script>

<style lang="scss">
.card,
.table,
.form,
.alert {
  margin-top: 15px !important;
}
</style>

<style lang="scss" scoped>
@media screen and (min-width: 1000px) {
  .container {
    width: 60%;
    margin: 0 auto;
  }
}
</style>
