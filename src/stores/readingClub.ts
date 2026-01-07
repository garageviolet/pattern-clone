import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { ReadingClubSession } from '../types/content'
import { readingClubSessions } from '../mocks/readingClub'
import apiClient from '../services/http'

interface ReadingClubState {
  sessions: ReadingClubSession[]
  loading: boolean
  error: string | null
}

// Images are served directly from qiniu CDN without the /static/pattern/main/ prefix

const weekdayMap: Record<number, string> = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日',
}

const stageMap: Record<
  number,
  { label: string; type: ReadingClubSession['statusType'] }
> = {
  0: { label: '上新', type: 'new' },
  1: { label: '进行中', type: 'running' },
  2: { label: '已结束', type: 'ended' },
}

export const useReadingClubStore = defineStore('readingClub', {
  state: (): ReadingClubState => ({
    sessions: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSessions(useMock = false) {
      this.loading = true
      this.error = null
      try {
        if (useMock) {
          await new Promise((resolve) => setTimeout(resolve, 450))
          this.sessions = readingClubSessions
          console.log(`Using mock data: ${this.sessions.length} sessions`)
          return
        }

        console.log('Fetching study groups from API...')
        const groups = await fetchAllStudyGroups()
        this.sessions = groups.map(transformStudyGroup)
        console.log(`Successfully loaded ${this.sessions.length} sessions from API`)
      } catch (error) {
        console.error('study_groups API failed, fallback to mock data.', error)
        console.error('Error details:', error instanceof Error ? error.message : String(error))
        this.sessions = readingClubSessions
        this.error =
          error instanceof Error ? error.message : '未知错误，请稍后再试'
      } finally {
        this.loading = false
      }
    },
  },
})
async function fetchAllStudyGroups(): Promise<any[]> {
  const perPage = 50
  let page = 1
  let lastPage = 1
  const groups: any[] = []

  try {
    do {
      const response = await apiClient.get('/study_groups', {
        params: {
          page,
          per_page: perPage,
        },
      })

      const pageData = response.data?.data ?? []
      groups.push(...pageData)
      console.log(`Fetched page ${page}: ${pageData.length} items (total: ${groups.length})`)

      const meta = response.data?.meta
      lastPage = meta?.last_page ?? page
      page += 1
    } while (page <= lastPage)

    console.log(`Total study groups fetched: ${groups.length} across ${lastPage} page(s)`)
    return groups
  } catch (error) {
    console.error('Error fetching study groups:', error)
    throw error
  }
}


function transformStudyGroup(group: any): ReadingClubSession {
  const stage = stageMap[group.stage as number] ?? stageMap[1]!
  const startDate = dayjs(group.start_date)
  const estimatedEnd = startDate.add(group.issues_total ?? 0, 'week')
  const now = dayjs()
  const diffDays = startDate.diff(now, 'day')
  const countdown =
    group.stage === 0 && diffDays > 0 ? `${diffDays} 天后` : '直播进行中'

  return {
    id: String(group.id),
    title: group.name,
    countdown,
    cohortInfo: `共${group.issues_total ?? 0}期`,
    membersInfo: `${group.participants_count ?? 0}位会友`,
    dateRange: `起止时间:${startDate.format('YYYY.MM.DD')}~${estimatedEnd.format('YYYY.MM')}`,
    weeklySchedule: `每${weekdayMap[group.day_number] ?? '周'} ${formatTime(
      group.start_time,
    )}~${formatTime(group.end_time)}`,
    tags: group.subject ? [group.subject.name] : [],
    hashtags: group.tags ?? [],
    summary: group.summary,
    cover: buildAssetUrl(group.image),
    link: `https://pattern.swarma.org/study_groups/${group.id}`,
    statusLabel: stage.label,
    statusType: stage.type,
  }
}

function buildAssetUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  // Images are served directly from qiniu CDN
  return `https://qiniu.pattern.swarma.org/${path}`
}

function formatTime(time: string): string {
  return time ? time.slice(0, 5) : '--:--'
}

