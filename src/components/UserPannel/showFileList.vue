<template>
  <el-card class="card" v-loading="getFileListForm.pending">
    <el-table
      border
      stripe
      ref="fileListTableRef"
      :data="list"
      @row-click="clickRow"
      @row-dblclick="dblclickRow"
      @selection-change="clickSelection"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="文件名">
        <template #default="scope">
          <el-space wrap>
            <img :src="scope.row.isdir == '1' ? folder : unknownfile" />
            {{ scope.row.server_filename }}
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template #default="scope"> {{ formatTimestamp(scope.row.server_mtime) }} </template>
      </el-table-column>
      <el-table-column label="大小">
        <template #default="scope"> {{ formatBytes(scope.row.size) }} </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
