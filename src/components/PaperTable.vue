<template>
  <a-table
    :columns="columns"
    :data-source="papers"
    :loading="loading"
    row-key="id"
    :pagination="false"
    class="paper-table"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'title'">
        <div class="paper-title">
          <strong>{{ record.title }}</strong>
          <p>{{ record.abstract }}</p>
          <div class="tags">
            <a-tag v-for="tag in record.tags" :key="tag" color="geekblue">
              {{ tag }}
            </a-tag>
          </div>
        </div>
      </template>
      <template v-else-if="column.key === 'authors'">
        {{ record.authors.join('、') }}
      </template>
      <template v-else-if="column.key === 'year'">
        {{ record.year }}
      </template>
      <template v-else-if="column.key === 'domain'">
        {{ record.domain }}
      </template>
      <template v-else-if="column.key === 'link'">
        <a-button type="link" size="small">查看</a-button>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import type { TableColumnType } from 'ant-design-vue'
import type { ResearchPaper } from '../types/content'

defineProps<{
  papers: ResearchPaper[]
  loading?: boolean
}>()

const columns: TableColumnType[] = [
  { title: '论文', dataIndex: 'title', key: 'title' },
  { title: '作者', dataIndex: 'authors', key: 'authors', width: 220 },
  { title: '年份', dataIndex: 'year', key: 'year', width: 80 },
  { title: '方向', dataIndex: 'domain', key: 'domain', width: 150 },
  { title: '链接', dataIndex: 'link', key: 'link', width: 80 },
]
</script>

<style scoped>
.paper-table :deep(.ant-table) {
  background: #fff;
  color: var(--swarma-text-primary);
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.paper-table :deep(.ant-table-thead > tr > th) {
  background: #fff;
  color: var(--swarma-text-secondary);
  font-size: 14px;
  font-weight: 500;
  padding: 12px 24px;
  border-bottom: 1px solid var(--swarma-dividers);
}

.paper-table :deep(.ant-table-tbody > tr > td) {
  border-color: var(--swarma-dividers);
  padding: 16px 24px;
  border-bottom: 1px solid var(--swarma-dividers);
}

.paper-table :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: none;
}

.paper-title strong {
  font-size: 16px;
  font-weight: 600;
  color: var(--swarma-text-title);
  line-height: 1.5;
  display: block;
  margin-bottom: 6px;
}

.paper-title p {
  margin: 0 0 8px;
  color: var(--swarma-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}
</style>

