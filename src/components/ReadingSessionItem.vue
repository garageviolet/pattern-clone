<template>
  <!-- Each reading session card = header (chip + title) + cover + detail stack -->
  <div class="session-item">
    <!-- HEADER: Status tag and title share the same baseline -->
    <div class="header-row">
      <!-- Hide status tag for ended sessions (已结束) -->
      <span v-if="session.statusType !== 'ended'" class="status-chip" :class="session.statusType">
        {{ session.statusLabel }}
      </span>
      <h3>{{ session.title }}</h3>
    </div>

    <!-- BODY: Cover thumbnail on the left, info stack on the right -->
    <div class="body-row">
      <div class="cover-section">
        <img :src="session.cover" :alt="session.title" />
      </div>

      <!-- DETAIL STACK: countdown, schedule, hashtags, action buttons -->
      <div class="content-section">
        <div class="meta-line">
          <span>{{ session.countdown }}</span>
          <span class="separator-dot" />
          <span>{{ session.cohortInfo }}</span>
          <span class="separator-dot" />
          <span class="members">
            <TeamOutlined />
          {{ session.membersInfo.replace(/^[约仅]\s*/, '') }}
          </span>
        </div>

        <div class="schedule-line">
          <span class="schedule-label">起止时间：</span>
          <span class="schedule-range">{{ session.dateRange }}</span>
          <span class="separator-dot" />
          <span class="weekly-line">
            <ClockCircleOutlined />
            {{ session.weeklySchedule }}
          </span>
        </div>

        <div class="hashtags" v-if="session.hashtags.length">
          <span v-for="tag in session.hashtags" :key="tag">#{{ normalizeTag(tag) }}</span>
        </div>

        <!-- CTA buttons -->
        <div class="cta-row">
          <a-button class="ghost-button">共创任务</a-button>
          <a-button type="primary" class="primary-button">报名读书会</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Icon buttons + session typing
import { ClockCircleOutlined, TeamOutlined } from '@ant-design/icons-vue'
import type { ReadingClubSession } from '../types/content'

defineProps<{
  session: ReadingClubSession
}>()

const normalizeTag = (tag: string) => tag.replace(/^#+/, '')
</script>

<style scoped>
/* ===============================
   CARD LAYOUT (header / body / footer)
   =============================== */
.session-item {
  --item-side-gap: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px var(--item-side-gap) 35px;
}

.session-item::after {
  content: '';
  position: absolute;
  left: var(--item-side-gap);
  right: var(--item-side-gap);
  bottom: 0;
  height: 1px;
  background: var(--swarma-dividers);
}

.session-item:last-child::after {
  display: none;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.body-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  align-items: stretch;
}

.cover-section {
  width: 176px;
  height: 132px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(180deg, #f9f9f9, #ececec);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.cover-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ===============================
   TITLE + STATUS CHIP
   =============================== */
.status-chip {
  padding: 4px 10px;
  border-radius: 0px 16px 16px 0px;
  font-size: 13px;
  font-weight: 250;
  color: #fff;
  display: inline-flex;
  align-items: center;
}

.status-chip.new {
  background: #5fc249;
}

.status-chip.running {
  background: #1890ff;
}

.status-chip.ended {
  background: #999;
}

h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--swarma-text-title);
}

/* ===============================
   META + SCHEDULE ROWS
   =============================== */
.meta-line,
.schedule-line {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  font-size: 14px;
  color: black;
  line-height: 1.6;
}

.meta-line {
  font-weight: 400;
}

.separator-dot {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: var(--swarma-dividers);
  align-self: center;
}

.members,
.weekly-line {
  display: inline-flex;
  align-items: center;
  gap: 1px;
}

.members {
  margin-left: 10px;
}

.schedule-label {
  color: black;
}

.schedule-range {
  font-weight: 400;
  color: var(--swarma-text-title);
}

/* ===============================
   HASHTAGS
   =============================== */
.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--swarma-text-secondary);
  font-size: 13px;
}

.cta-row {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cta-row :deep(.ant-btn) {
  min-width: 110px;
  height: 36px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  padding: 0 16px;
}

.ghost-button {
  border-color: var(--swarma-primary);
  color: var(--swarma-primary);
  padding: 0 20px 0 18px;
  background: transparent;
}

.ghost-button:hover {
  background: rgba(0, 0, 0, 0.04) !important; /* Light grey background on hover */
  border-color: var(--swarma-primary) !important;
  color: var(--swarma-primary) !important;
}

.primary-button {
  background: var(--swarma-primary);
  border-color: var(--swarma-primary);
  padding: 0 12px 0 16px;
}

.primary-button:hover {
  background: #40a9ff !important; /* Slightly lighter blue on hover */
  border-color: #40a9ff !important;
  color: #fff !important; /* Keep white text */
}

@media (max-width: 768px) {
  .body-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .cover-section {
    width: 100%;
  }

  .cta-row {
    justify-content: flex-start;
  }
}
</style>

