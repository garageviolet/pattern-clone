<template>
  <div class="courses-card">
    <!-- Header with blue left border -->
    <div class="card-header">
      <span class="header-title">最新课程</span>
      <a href="https://campus.swarma.org" target="_blank" class="more-link">更多</a>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <a-spin size="small" />
    </div>

    <!-- Courses list -->
    <div v-else class="courses-list">
      <a 
        v-for="course in courses" 
        :key="course.id" 
        :href="course.link"
        target="_blank"
        class="course-item"
      >
        <!-- Course title -->
        <h4 class="course-title">{{ course.title }}</h4>
        
        <!-- Content row: thumbnail + description -->
        <div class="course-content">
          <img :src="course.cover" :alt="course.title" class="course-cover" />
          <p class="course-desc">{{ course.description }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Course {
  id: number
  title: string
  cover: string
  description: string
  link: string
}

const courses = ref<Course[]>([])
const loading = ref(true)

const IMAGE_BASE = 'https://qiniu.pattern.swarma.org/'

// Fetch courses from API
async function fetchCourses() {
  loading.value = true
  try {
    console.log('Fetching courses from API...')
    const response = await axios.get('/swarma_api/index/courses')
    
    const data = response.data
    if (Array.isArray(data) && data.length > 0) {
      courses.value = data.slice(0, 7).map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: item.image?.startsWith('http') ? item.image : `${IMAGE_BASE}${item.image}`,
        description: item.introduction || '',
        link: `https://campus.swarma.org/course/${item.id}`,
      }))
      console.log(`Loaded ${courses.value.length} courses from API`)
    } else {
      throw new Error('Empty response')
    }
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    // Fallback to mock data
    courses.value = [
      {
        id: 1,
        title: '控制科学前沿理论与方法',
        cover: 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=200',
        description: '本课程为面向控制专业领域学生以及跨领域的学习者做深度科普，帮助学习控制论的核心思想、框架与方法。',
        link: '#',
      },
      {
        id: 2,
        title: '第三代人工智能技术基础——从可微分编程到因果推理',
        cover: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=200',
        description: '本课程中，试图系统化地梳理从机器学习到大语言模型，从图神经网络到因果推理等一系列可能成为第三代人工智能基础...',
        link: '#',
      },
      {
        id: 3,
        title: '混沌科学系列科普课程',
        cover: 'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=200',
        description: '本系列课程，联合陈关荣、王雄、李春彪、张旭、马军、刘坚、王青云、叶国栋、禹思敏九位国内的混沌理论研究专...',
        link: '#',
      },
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.courses-card {
  background: #fff;
  border-radius: 0;
  box-shadow: 0 10px 24px rgba(15, 31, 48, 0.05);
}

/* Header with blue left border */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.more-link {
  font-size: 13px;
  color: var(--swarma-primary);
  text-decoration: none;
}

.more-link:hover {
  text-decoration: underline;
}

/* Loading state */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}

/* Courses list */
.courses-list {
  display: flex;
  flex-direction: column;
}

.course-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid var(--swarma-dividers);
  text-decoration: none;
  transition: background 0.2s;
}

.course-item:last-child {
  border-bottom: none;
}

.course-item:hover {
  background: var(--swarma-background);
}

/* Course title */
.course-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--swarma-primary);
  line-height: 1.5;
}

/* Content row: cover + description */
.course-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

/* Cover image */
.course-cover {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

/* Description */
.course-desc {
  margin: 0;
  font-size: 13px;
  color: var(--swarma-text-primary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

