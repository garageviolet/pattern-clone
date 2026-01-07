import { defineStore } from 'pinia'
import axios from 'axios'
import type { LearningPath } from '../types/content'
import { learningPaths } from '../mocks/paths'

// API response types
interface ApiUser {
  id: number
  nick_name: string
  avatar: string
  introduce: string
  title: { name: string }[]
}

interface ApiLearnPath {
  id: number
  title: string
  image: string
  content: string
  user: ApiUser
  views: number
  like_number: number
  comment_number: number
  created_at: string
  updated_at: string
}

interface ApiResponse {
  data: ApiLearnPath[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}

interface PathsState {
  paths: LearningPath[]
  loading: boolean
  error: string | null
  levelFilter: LearningPath['level'] | '全部'
}

// Helper to format relative time
function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 1) return '今天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`
  return `${Math.floor(diffDays / 365)}年前`
}

// Transform API data to our LearningPath type
function transformApiPath(apiPath: ApiLearnPath): LearningPath {
  // Build cover URL - handle relative paths
  let cover = apiPath.image || ''
  if (cover && !cover.startsWith('http')) {
    cover = cover.startsWith('//') ? `https:${cover}` : `https://qiniu.pattern.swarma.org/${cover}`
  }
  
  // Build author avatar URL
  let avatar = apiPath.user?.avatar || ''
  if (avatar && !avatar.startsWith('http')) {
    avatar = `https://qiniu.pattern.swarma.org/${avatar}`
  }
  
  // Get author title/role
  const authorTitle = apiPath.user?.title?.[0]?.name || apiPath.user?.introduce || '学习者'
  
  return {
    id: String(apiPath.id),
    title: apiPath.title,
    description: apiPath.content?.substring(0, 200) || '',
    content: apiPath.content || '',
    cover: cover,
    level: '进阶', // API doesn't provide this, default to 进阶
    durationWeeks: 8, // API doesn't provide this
    topics: [], // Could extract from content if needed
    progress: 0,
    mentor: apiPath.user?.nick_name || '未知',
    resources: 0,
    author: {
      name: apiPath.user?.nick_name || '未知用户',
      role: authorTitle,
      avatar: avatar,
    },
    likes: apiPath.like_number || 0,
    comments: apiPath.comment_number || 0,
    timeAgo: formatTimeAgo(apiPath.updated_at || apiPath.created_at),
    link: `https://pattern.swarma.org/path/${apiPath.id}`,
  }
}

export const usePathsStore = defineStore('paths', {
  state: (): PathsState => ({
    paths: [],
    loading: false,
    error: null,
    levelFilter: '全部',
  }),
  getters: {
    filteredPaths(state) {
      if (state.levelFilter === '全部') return state.paths
      return state.paths.filter((path) => path.level === state.levelFilter)
    },
  },
  actions: {
    async fetchPaths() {
      this.loading = true
      this.error = null
      try {
        // Fetch all pages from api.swarma.org learn_paths API
        const allPaths: LearningPath[] = []
        let page = 1
        let lastPage = 1
        
        do {
          console.log(`Fetching learn_paths page ${page}...`)
          const response = await axios.get<ApiResponse>(
            `/swarma_api/index/learn_paths`,
            {
              params: {
                serious: 1,
                substr_len: 200,
                page: page,
                per_page: 15,
              },
            }
          )
          
          const data = response.data
          lastPage = data.meta?.last_page || 1
          
          if (data.data && Array.isArray(data.data)) {
            const transformedPaths = data.data.map(transformApiPath)
            allPaths.push(...transformedPaths)
            console.log(`Page ${page}: fetched ${data.data.length} paths`)
          }
          
          page++
        } while (page <= lastPage)
        
        this.paths = allPaths
        console.log(`Total: loaded ${this.paths.length} learning paths from API`)
      } catch (error) {
        console.error('Failed to fetch paths from API:', error)
        // Fallback to mock data
        this.paths = learningPaths
        console.log(`Fallback: loaded ${this.paths.length} paths from mock data`)
        this.error =
          error instanceof Error ? error.message : '未知错误，请稍后再试'
      } finally {
        this.loading = false
      }
    },
    setLevelFilter(level: PathsState['levelFilter']) {
      this.levelFilter = level
    },
  },
})

