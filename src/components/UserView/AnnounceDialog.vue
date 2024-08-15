<template>
  <el-dialog v-model="config.show_announce" title="公告" width="60%" :close-on-click-modal="false">
    <span v-html="config.announce"></span>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" @click="remberAnnounce"> 下次不再提示 </el-button>
        <el-button type="primary" @click="closeDialog()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useMainStore } from '@/stores/mainStore.js'
import { setRemberAnnounce } from '@/utils/env.js'
import { storeToRefs } from 'pinia'

const mainStore = useMainStore()
const { config } = storeToRefs(mainStore)

const closeDialog = () => (config.value.show_announce = false)

const remberAnnounce = () => {
  setRemberAnnounce(config.value.announce)
  closeDialog()
}
</script>

<style lang="scss" scoped></style>
