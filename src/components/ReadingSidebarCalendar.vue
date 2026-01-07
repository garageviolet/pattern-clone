<template>
  <div class="sidebar-card">
    <!-- Header with blue left border -->
    <div class="card-header">
      <span class="header-title">读书会上新日历</span>
    </div>

    <!-- Month navigation row -->
    <div class="month-nav">
      <button class="nav-arrow" @click="prevMonth">&lt;</button>
      <span class="month-label">{{ monthLabel }}</span>
      <button class="nav-arrow" @click="nextMonth">&gt;</button>
    </div>

    <!-- Weekday headers -->
    <div class="calendar-grid">
      <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
    </div>

    <!-- Calendar dates -->
    <div class="calendar-grid dates-grid">
      <div
        v-for="cell in calendarCells"
        :key="cell.key"
        class="calendar-cell"
        :class="{
          'other-month': cell.isOtherMonth,
          'has-event': cell.hasEvent,
          'selected': selectedDate === cell.dateStr
        }"
        @click="selectDate(cell)"
      >
        <span 
          class="date-number"
          :class="cell.colorClass"
          :style="cell.hasEvent ? { backgroundColor: cell.bgColor, color: cell.textColor } : {}"
        >
          {{ cell.day }}
          <span v-if="cell.hasEvent" class="event-dot" :style="{ backgroundColor: cell.dotColor }"></span>
        </span>
      </div>
    </div>

    <!-- Selected date events -->
    <div v-if="selectedDateEvents.length" class="events-section">
      <div class="events-header">
        <span class="events-date">{{ selectedDateLabel }}</span>
      </div>
      <div v-for="event in selectedDateEvents" :key="event.id" class="event-item">
        <span class="event-dot-inline" :style="{ backgroundColor: getEventColor(event) }"></span>
        <span class="event-time">{{ event.weeklySchedule.split(' ')[1]?.split('~')[0] || '19:30' }}</span>
        <span class="event-title">{{ event.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useReadingClubStore } from '../stores/readingClub'
import dayjs from 'dayjs'

const store = useReadingClubStore()

// Fetch sessions if not already loaded (for when calendar is shown on other pages)
onMounted(() => {
  if (store.sessions.length === 0 && !store.loading) {
    store.fetchSessions()
  }
})

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

// Current displayed month
const currentMonth = ref(dayjs())
const selectedDate = ref<string | null>(null)

// Color palette for events (cycle through these based on event index)
// Medium background colors with white text, medium dots for distinction
const eventColors = [
  { bg: '#ffcc80', text: '#fff', dot: '#ff9800' }, // Orange - medium bg, medium dot
  { bg: '#a5d6a7', text: '#fff', dot: '#4caf50' }, // Green - medium bg, medium dot
  { bg: '#f48fb1', text: '#fff', dot: '#e91e63' }, // Pink - medium bg, medium dot
  { bg: '#90caf9', text: '#fff', dot: '#1890ff' }, // Blue - medium bg, medium dot
]

// Month navigation
const prevMonth = () => {
  currentMonth.value = currentMonth.value.subtract(1, 'month')
}

const nextMonth = () => {
  currentMonth.value = currentMonth.value.add(1, 'month')
}

// Month label (e.g., "November 2025")
const monthLabel = computed(() => {
  return currentMonth.value.format('MMMM YYYY')
})

// Build a map of dates to events
const eventsByDate = computed(() => {
  const map: Record<string, typeof store.sessions> = {}
  
  store.sessions.forEach((session, index) => {
    // Parse the date range to get all event dates
    // weeklySchedule format: "每周二 19:30~21:30"
    // dateRange format: "起止时间:2025.01.07~2025.03"
    
    const dateRangeMatch = session.dateRange.match(/(\d{4}\.\d{2}\.\d{2})~(\d{4}\.\d{2})/)
    if (!dateRangeMatch) return
    
    const startDate = dayjs(dateRangeMatch[1], 'YYYY.MM.DD')
    const endDate = dayjs(dateRangeMatch[2] + '.28', 'YYYY.MM.DD') // Approximate end
    
    // Get the weekday from weeklySchedule
    const weekdayMatch = session.weeklySchedule.match(/每(周[一二三四五六日])/)
    if (!weekdayMatch) return
    
    const weekdayMapLocal: Record<string, number> = {
      '周日': 0, '周一': 1, '周二': 2, '周三': 3, '周四': 4, '周五': 5, '周六': 6
    }
    const weekdayKey = weekdayMatch[1]
    if (!weekdayKey || !(weekdayKey in weekdayMapLocal)) return
    const targetWeekday = weekdayMapLocal[weekdayKey]
    
    // Find all dates in the range that match the weekday
    let current = startDate
    while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
      if (current.day() === targetWeekday) {
        const dateStr = current.format('YYYY-MM-DD')
        if (!map[dateStr]) map[dateStr] = []
        map[dateStr].push({ ...session, _colorIndex: index % eventColors.length } as any)
      }
      current = current.add(1, 'day')
    }
  })
  
  return map
})

// Generate calendar cells for current month
const calendarCells = computed(() => {
  const firstDay = currentMonth.value.startOf('month')
  const lastDay = currentMonth.value.endOf('month')
  const startDayOfWeek = firstDay.day() // 0 = Sunday
  
  const cells = []
  
  // Add empty cells for days before the 1st
  const prevMonth = currentMonth.value.subtract(1, 'month')
  const prevMonthDays = prevMonth.daysInMonth()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    const date = prevMonth.date(day)
    const dateStr = date.format('YYYY-MM-DD')
    cells.push({
      key: `prev-${day}`,
      day,
      dateStr,
      isOtherMonth: true,
      hasEvent: false,
      colorClass: '',
      bgColor: '',
      textColor: '',
      dotColor: ''
    })
  }
  
  // Add cells for current month
  for (let day = 1; day <= lastDay.date(); day++) {
    const date = currentMonth.value.date(day)
    const dateStr = date.format('YYYY-MM-DD')
    const events = eventsByDate.value[dateStr] || []
    const hasEvent = events.length > 0
    const colorIndex = hasEvent ? ((events[0] as any)._colorIndex ?? 0) : 0
    const color = eventColors[colorIndex] ?? eventColors[0]
    
    cells.push({
      key: `curr-${day}`,
      day,
      dateStr,
      isOtherMonth: false,
      hasEvent,
      colorClass: hasEvent ? `color-${colorIndex}` : '',
      bgColor: hasEvent ? color!.bg : '',
      textColor: hasEvent ? color!.text : '',
      dotColor: hasEvent ? color!.dot : ''
    })
  }
  
  // Add empty cells for days after the last day
  const remainingCells = 42 - cells.length // 6 rows × 7 days
  const nextMonthObj = currentMonth.value.add(1, 'month')
  for (let i = 1; i <= remainingCells && cells.length < 42; i++) {
    const date = nextMonthObj.date(i)
    const dateStr = date.format('YYYY-MM-DD')
    cells.push({
      key: `next-${i}`,
      day: i,
      dateStr,
      isOtherMonth: true,
      hasEvent: false,
      colorClass: '',
      bgColor: '',
      textColor: '',
      dotColor: ''
    })
  }
  
  // Only show 5 rows if possible
  return cells.slice(0, 35)
})

// Handle date selection
const selectDate = (cell: typeof calendarCells.value[0]) => {
  if (cell.hasEvent) {
    selectedDate.value = cell.dateStr
  } else {
    selectedDate.value = null
  }
}

// Events for selected date
const selectedDateEvents = computed(() => {
  if (!selectedDate.value) return []
  return eventsByDate.value[selectedDate.value] || []
})

// Format selected date label
const selectedDateLabel = computed(() => {
  if (!selectedDate.value) return ''
  const date = dayjs(selectedDate.value)
  const weekdayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return `${date.format('M月D日')} ${weekdayNames[date.day()]}`
})

// Get event color
const getEventColor = (event: any): string => {
  const colorIndex = event._colorIndex ?? 0
  const defaultColor = { bg: '#e3f2fd', text: '#1565c0', dot: '#1890ff' }
  if (colorIndex >= 0 && colorIndex < eventColors.length) {
    const c = eventColors[colorIndex]
    return c ? c.dot : defaultColor.dot
  }
  return defaultColor.dot
}

// Auto-select today's date if it has events
watch(() => store.sessions, () => {
  const today = dayjs().format('YYYY-MM-DD')
  if (eventsByDate.value[today]) {
    selectedDate.value = today
  }
}, { immediate: true })
</script>

<style scoped>
.sidebar-card {
  background: #fff;
  border-radius: 0;
  box-shadow: 0 10px 24px rgba(15, 31, 48, 0.05);
  padding-bottom: 16px;
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

/* Month navigation */
.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px 16px;
}

.nav-arrow {
  width: 30px;
  height: 30px;
  border: none;
  background: #fff;
  color: var(--swarma-text-secondary);
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  transition: all 0.2s;
  padding: 20px;
  transform: scaleX(1);
  letter-spacing: 2px;
}

.nav-arrow:hover {
  background: rgba(0, 0, 0, 0.06);
}

.month-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--swarma-text-title);
}

/* Calendar grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 24px;
  text-align: center;
}

.weekday {
  font-size: 13px;
  font-weight: 500;
  color: var(--swarma-text-secondary);
  padding: 8px 0;
}

.dates-grid {
  gap: 2px 0;
}

/* Calendar cell */
.calendar-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 0;
  cursor: pointer;
  min-height: 44px;
}

.calendar-cell.other-month {
  opacity: 0;
  pointer-events: none;
}

.calendar-cell.has-event {
  cursor: pointer;
}

.calendar-cell.selected .date-number {
  box-shadow: 0 0 0 2px var(--swarma-primary);
}

/* Date number - circular style */
.date-number {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  color: var(--swarma-text-primary);
  transition: all 0.2s;
}

.calendar-cell:hover .date-number {
  background: rgba(0, 0, 0, 0.04);
}

.calendar-cell.has-event:hover .date-number {
  opacity: 0.8;
}

/* Event dot on the edge of the colored circle */
.event-dot {
  position: absolute;
  top:28px;
  right: 3;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 0px solid #fff;
}

/* Events section */
.events-section {
  margin-top: 16px;
  padding: 0 16px;
  border-top: 1px solid var(--swarma-dividers);
  padding-top: 16px;
}

.events-header {
  margin-bottom: 12px;
}

.events-date {
  font-size: 15px;
  font-weight: 600;
  color: var(--swarma-text-title);
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--swarma-text-primary);
}

.event-dot-inline {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.event-time {
  color: var(--swarma-text-secondary);
  flex-shrink: 0;
}

.event-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
