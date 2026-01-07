export interface ReadingClubSession {
  id: string
  title: string
  countdown: string
  cohortInfo: string
  membersInfo: string
  dateRange: string
  weeklySchedule: string
  tags: string[]
  hashtags: string[]
  summary?: string
  cover: string
  link: string
  statusLabel: string
  statusType: 'new' | 'running' | 'ended'
}

export interface LearningPath {
  id: string
  title: string
  description: string
  content: string
  cover: string
  level: '入门' | '进阶' | '专家'
  durationWeeks: number
  topics: string[]
  progress: number
  mentor: string
  resources: number
  author: {
    name: string
    role: string
    avatar: string
  }
  likes: number
  comments: number
  timeAgo: string
  link: string
}

export interface ResearchPaper {
  id: string
  title: string
  titleCn?: string
  authors: string[]
  year: number
  date: string
  journal?: string
  domain: string
  tags: string[]
  abstract: string      // Chinese abstract (shown by default)
  abstractEn?: string   // English abstract (shown when expanded)
  thumbnails?: string[]
  link: string
}

