<template>
  <div class="ranking-card">
    <!-- Header with blue left border -->
    <div class="card-header">
      <span class="header-title">读书会热度榜</span>
    </div>

    <!-- Tab buttons: 近期, 年度, 免费 -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-btn', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Ranking list -->
    <div class="ranking-list">
      <div v-for="(item, index) in ranking" :key="item.title" class="ranking-item">
        <!-- Numbered title row -->
        <div class="item-header">
          <span class="item-index">{{ index + 1 }}.</span>
          <span class="item-title">{{ item.title }}</span>
        </div>

        <!-- Content row: thumbnail + stats -->
        <div class="item-content">
          <img :src="item.cover" :alt="item.title" class="item-cover" />
          <div class="item-stats">
            <div class="stat-row heat-row">
              <FireOutlined class="heat-icon" />
              <span class="heat-value">{{ item.heat }}</span>
            </div>
            <div class="stat-row">
              <ClockCircleOutlined class="stat-icon" />
              <span>{{ item.duration }}</span>
            </div>
            <div class="stat-row">
              <UserOutlined class="stat-icon" />
              <span>{{ item.host }}</span>
            </div>
            <div class="stat-row">
              <TagOutlined class="stat-icon" />
              <span>共创术语：{{ item.terms }}</span>
            </div>
            <div class="stat-row">
              <FolderOutlined class="stat-icon" />
              <span>共创资源：{{ item.resources }}</span>
            </div>
          </div>
        </div>

        <!-- Hashtags -->
        <div class="item-hashtags">
          <span v-for="tag in item.hashtags" :key="tag" class="hashtag">#{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  FireOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TagOutlined,
  FolderOutlined,
} from '@ant-design/icons-vue'

const tabs = ['近期', '年度', '免费']
const activeTab = ref('近期')

const ranking = [
  {
    title: '意识研究全景：从哲学到科学',
    heat: 131,
    duration: '1小时57分36秒',
    host: '李恒威',
    terms: 91,
    resources: 0,
    hashtags: ['意识科学'],
    cover: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=120',
  },
  {
    title: '启发式算法在瓦解问题中的效率',
    heat: 116,
    duration: '2小时0分44秒',
    host: '谭索怡 张君杰 徐任杰 ...',
    terms: 670,
    resources: 0,
    hashtags: ['复杂网络', '强化学习'],
    cover: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=120',
  },
  {
    title: '网络瓦解领域概览',
    heat: 110,
    duration: '2小时6分50秒',
    host: '吴俊',
    terms: 777,
    resources: 0,
    hashtags: ['复杂科学', '强化学习'],
    cover: 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=120',
  },
  {
    title: '非线性动力学 - 从逻辑斯谛映射到复杂性阶梯',
    heat: 71,
    duration: '3小时41分8秒',
    host: '张江',
    terms: 1177,
    resources: 1,
    hashtags: ['动力学', '混沌', '自指', '逻辑斯谛映射', '因果涌现', '向下因果'],
    cover: 'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=120',
  },
  {
    title: '特定约束下的网络瓦解问题',
    heat: 62,
    duration: '1小时53分50秒',
    host: '卿枫 胡雯 洪莉',
    terms: 447,
    resources: 0,
    hashtags: ['复杂网络', '强化学习', '深度学习', '攻防博弈', '成本约束'],
    cover: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=120',
  },
  {
    title: '基于人工智能的多尺度脑网络连接建模',
    heat: 57,
    duration: '1小时17分13秒',
    host: '李宗晟',
    terms: 186,
    resources: 0,
    hashtags: ['人工智能', '多尺度脑网络', '图神经网络', 'ANN', '因果涌现'],
    cover: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg?auto=compress&cs=tinysrgb&w=120',
  },
]
</script>

<style scoped>
.ranking-card {
  background: #fff;
  border-radius: 0;
  box-shadow: 0 10px 24px rgba(15, 31, 48, 0.05);
}

/* Header with floating blue bar - inside the card */
.card-header {
  padding: 16px 16px 12px 12px;
  margin-left: 16px;
  margin-top: 16px;
  position: relative;
}

.card-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  bottom: 7px;
  width: 4px;
  background: var(--swarma-primary);
  border-radius: 0px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--swarma-text-title);
}

/* Tab buttons */
.tabs {
  display: flex;
  gap: 0;
  padding: 0 16px;
  border-bottom: 1px solid var(--swarma-dividers);
}

.tab-btn {
  padding: 8px 16px;
  background: none;
  border: none;
  font-size: 14px;
  color: var(--swarma-text-secondary);
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-btn:hover {
  color: var(--swarma-primary);
}

.tab-btn.active {
  color: var(--swarma-primary);
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--swarma-primary);
}

/* Ranking list */
.ranking-list {
  display: flex;
  flex-direction: column;
}

.ranking-item {
  padding: 16px;
  border-bottom: 1px solid var(--swarma-dividers);
}

.ranking-item:last-child {
  border-bottom: none;
}

/* Item header: number + title */
.item-header {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.item-index {
  font-size: 14px;
  font-weight: 400;
  color: var(--swarma-text-title);
  flex-shrink: 0;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--swarma-text-title);
  line-height: 1.4;
}

/* Item content: cover + stats */
.item-content {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.item-cover {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--swarma-text-secondary);
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  font-size: 12px;
  color: var(--swarma-text-disable);
}

.heat-row {
  color: red;
}

.heat-icon {
  font-size: 12px;
  color: red;
}

.heat-value {
  font-weight: 500;
}

/* Hashtags */
.item-hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hashtag {
  font-size: 12px;
  color: var(--swarma-text-secondary);
  cursor: pointer;
}

.hashtag:hover {
  text-decoration: underline;
}
</style>
