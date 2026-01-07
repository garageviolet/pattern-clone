import { defineStore } from 'pinia'
import axios from 'axios'
import type { ResearchPaper } from '../types/content'
import { researchPapers } from '../mocks/papers'

// API response types for express/top_issue
interface ApiPaper {
  uuid: string
  title: string
  title_cn: string
  authors: string[] | string
  labels: string | string[] | null
  category: string
  abstract: string
  abstract_cn: string
  link: string
  journal: string
  submitTime: string
  images: string[]
  like_number: number
}

// API response types for user_papers
interface UserPaper {
  uuid: string
  title: string
  authors: string[]
  link: string
  abstract: string
  journal: string
  labels: string | string[] | null
  images: string[] | null
  submitTime: string
  user: {
    nick_name: string
    avatar: string
  }
}

interface UserPapersResponse {
  data: UserPaper[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}

type PaperSource = 'complexity' | 'ai-science' | 'arxiv' | 'user'

interface PapersState {
  papers: ResearchPaper[]
  loading: boolean
  error: string | null
  domainFilter: string
  searchKeyword: string
  currentSource: PaperSource
}

// Image base URL
const IMAGE_BASE = 'https://qiniu.pattern.swarma.org/'

// Transform API paper to ResearchPaper format
function transformApiPaper(item: ApiPaper): ResearchPaper {
  const date = item.submitTime || new Date().toISOString().split('T')[0]
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear()
  
  // Handle authors - can be array or string
  let authors: string[] = []
  if (Array.isArray(item.authors)) {
    authors = item.authors.filter(a => a && a.trim())
  } else if (typeof item.authors === 'string' && item.authors.trim()) {
    authors = item.authors.split(',').map(a => a.trim()).filter(Boolean)
  }
  if (authors.length === 0) {
    authors = ['Unknown']
  }
  
  // Build thumbnail URLs
  const thumbnails = (item.images || []).map(img => {
    if (!img) return ''
    if (img.startsWith('http')) return img
    return `${IMAGE_BASE}${img}`
  }).filter(Boolean)
  
  // Handle labels - can be string, array, or null
  let tags: string[] = ['复杂科学']
  if (typeof item.labels === 'string' && item.labels.trim()) {
    tags = item.labels.split(',').map(l => l.trim()).filter(Boolean)
  } else if (Array.isArray(item.labels)) {
    tags = item.labels.filter(l => l && typeof l === 'string')
  }
  if (tags.length === 0) {
    tags = ['复杂科学']
  }
  
  return {
    id: item.uuid,
    title: item.title || item.title_cn,
    titleCn: item.title_cn || undefined,
    authors: authors,
    year: year,
    date: date,
    journal: item.journal || undefined,
    domain: item.category || 'Complex Systems',
    tags: tags,
    abstract: item.abstract_cn || item.abstract || '',  // Chinese abstract (default view)
    abstractEn: item.abstract || '',                     // English abstract (expanded view)
    thumbnails: thumbnails.slice(0, 7),
    link: item.link || `https://pattern.swarma.org/paper/${item.uuid}`,
  }
}

// Transform user paper to ResearchPaper format
function transformUserPaper(item: UserPaper): ResearchPaper {
  const date = item.submitTime || new Date().toISOString().split('T')[0]
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear()
  
  // Handle authors
  let authors = item.authors || []
  if (authors.length === 0) {
    authors = ['Unknown']
  }
  
  // Build thumbnail URLs
  const thumbnails = (item.images || []).map(img => {
    if (!img) return ''
    if (img.startsWith('http')) return img
    return `${IMAGE_BASE}${img}`
  }).filter(Boolean)
  
  // Handle labels
  let tags: string[] = ['用户推荐']
  if (typeof item.labels === 'string' && item.labels.trim()) {
    tags = item.labels.split(',').map(l => l.trim()).filter(Boolean)
  } else if (Array.isArray(item.labels)) {
    tags = item.labels.filter(l => l && typeof l === 'string')
  }
  if (tags.length === 0) {
    tags = ['用户推荐']
  }
  
  return {
    id: item.uuid,
    title: item.title,
    titleCn: undefined,
    authors: authors,
    year: year,
    date: date,
    journal: item.journal || undefined,
    domain: 'User Recommended',
    tags: tags,
    abstract: item.abstract || '',
    abstractEn: item.abstract || '',
    thumbnails: thumbnails.slice(0, 7),
    link: item.link || `https://pattern.swarma.org/paper/${item.uuid}`,
  }
}

export const usePapersStore = defineStore('papers', {
  state: (): PapersState => ({
    papers: [],
    loading: false,
    error: null,
    domainFilter: '全部',
    searchKeyword: '',
    currentSource: 'complexity',
  }),
  getters: {
    filteredPapers(state) {
      return state.papers.filter((paper) => {
        const domainOk =
          state.domainFilter === '全部' ||
          paper.domain === state.domainFilter
        const keyword = state.searchKeyword.trim().toLowerCase()
        const keywordOk =
          !keyword ||
          paper.title.toLowerCase().includes(keyword) ||
          paper.tags.some((tag) => tag.toLowerCase().includes(keyword)) ||
          paper.authors.some((author) =>
            author.toLowerCase().includes(keyword),
          )
        return domainOk && keywordOk
      })
    },
    domainOptions(state) {
      const domains = new Set<string>(['全部'])
      state.papers.forEach((paper) => domains.add(paper.domain))
      return Array.from(domains)
    },
  },
  actions: {
    async fetchPapers(source: PaperSource = 'complexity') {
      this.loading = true
      this.error = null
      this.currentSource = source
      
      try {
        if (source === 'complexity' || source === 'ai-science') {
          // Fetch from api.swarma.org express/top_issue API using PUT method
          const endDate = new Date().toISOString().split('T')[0]
          const startDate = '2024-01-01'
          
          console.log(`Fetching ${source} papers from ${startDate} to ${endDate}...`)
          const response = await axios.put<ApiPaper[]>(
            `/swarma_api/express/top_issue?_t=${Date.now()}`,
            {
              start: startDate,
              end: endDate,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            }
          )
          
          const data = response.data
          if (Array.isArray(data) && data.length > 0) {
            this.papers = data.map(transformApiPaper)
            console.log(`Loaded ${this.papers.length} ${source} papers from API`)
          } else {
            throw new Error('Empty API response')
          }
        } else if (source === 'user') {
          // Fetch from api.swarma.org user_papers API
          console.log('Fetching user recommended papers...')
          const allPapers: ResearchPaper[] = []
          let page = 1
          const maxPages = 5 // Limit to first 5 pages for performance
          
          do {
            const response = await axios.get<UserPapersResponse>(
              `/swarma_api/user_papers`,
              {
                params: {
                  page: page,
                  per_page: 20,
                },
              }
            )
            
            const data = response.data
            if (data.data && Array.isArray(data.data)) {
              const transformedPapers = data.data.map(transformUserPaper)
              allPapers.push(...transformedPapers)
              console.log(`Page ${page}: fetched ${data.data.length} user papers`)
              
              if (page >= data.meta?.last_page || page >= maxPages) {
                break
              }
            } else {
              break
            }
            page++
          } while (page <= maxPages)
          
          this.papers = allPapers
          console.log(`Loaded ${this.papers.length} user recommended papers from API`)
        } else if (source === 'arxiv') {
          // arXiv API doesn't work, use mock data with arXiv-style entries
          console.log('Fetching arXiv papers (using complexity API as fallback)...')
          const endDate = new Date().toISOString().split('T')[0]
          const startDate = '2024-01-01'
          
          const response = await axios.put<ApiPaper[]>(
            `/swarma_api/express/top_issue?_t=${Date.now()}`,
            {
              start: startDate,
              end: endDate,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            }
          )
          
          const data = response.data
          if (Array.isArray(data) && data.length > 0) {
            // Filter for papers that might be from arXiv (have arxiv in link or no journal)
            const arxivPapers = data
              .filter(p => !p.journal || p.link?.includes('arxiv'))
              .map(transformApiPaper)
            this.papers = arxivPapers.length > 0 ? arxivPapers : data.slice(0, 100).map(transformApiPaper)
            console.log(`Loaded ${this.papers.length} arXiv papers`)
          } else {
            throw new Error('Empty API response')
          }
        }
      } catch (error) {
        console.error(`Failed to fetch ${source} papers from API:`, error)
        console.log('Falling back to mock data...')
        this.papers = researchPapers
        this.error =
          error instanceof Error ? error.message : '未知错误，请稍后再试'
      } finally {
        this.loading = false
      }
    },
    setDomainFilter(domain: string) {
      this.domainFilter = domain
    },
    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword
    },
  },
})
