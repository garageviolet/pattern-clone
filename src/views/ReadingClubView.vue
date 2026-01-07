<template>
  <!-- ============================================
       READING CLUB PAGE LAYOUT
       ============================================ -->
  <!-- Two-column grid layout: main content (left) + sidebar (right) -->
  <section class="reading-layout">
    <!-- Main Content Column: Page header + reading session list -->
    <div class="main-column">
      <!-- Page Header: Description and topic tags -->
      <header class="page-head">
        <!-- Main description text explaining what the reading club is -->
        <p class="page-description">
          面向广大科研工作者的系列论文研读活动,复杂科学前沿方向的学术社区
        </p>
        
        <!-- Topic Tags: Filterable tags for different research areas (single selection) -->
        <div class="tag-cloud">
          <a-checkable-tag
            v-for="tag in topicTags"
            :key="tag"
            :checked="selectedTag === tag"
            @change="(checked: boolean) => handleTagClick(tag, checked)"
          >
            {{ tag }}
          </a-checkable-tag>
        </div>
      </header>

      <!-- Reading Session List: Displays filtered reading club sessions -->
      <div class="surface-card session-list">
        <!-- Loading spinner while fetching session data -->
        <a-spin :spinning="store.loading">
          <!-- Render each reading session as a card item (filtered by selected tag) -->
          <ReadingSessionItem
            v-for="session in filteredSessions"
            :key="session.id"
            :session="session"
          />
          <!-- Empty state when no sessions match the filter -->
          <div v-if="filteredSessions.length === 0 && !store.loading" class="empty-state">
            <a-empty description="没有找到匹配的读书会" />
          </div>
          <!-- End of list message -->
          <div v-if="filteredSessions.length > 0 && !store.loading" class="end-message">
            <span>没有更多了</span>
          </div>
        </a-spin>
      </div>
    </div>

    <!-- Sidebar Column: Calendar + Ranking + Encyclopedia + Articles + Courses + QRCode + Footer -->
    <aside class="sidebar-column">
      <ReadingSidebarCalendar />
      <ReadingSidebarRanking />
      <ReadingSidebarEncyclopedia />
      <ReadingSidebarArticles />
      <ReadingSidebarCourses />
      <ReadingSidebarQRCode />
      <SidebarFooter />
    </aside>
  </section>
</template>

<script setup lang="ts">
/* ============================================
   IMPORTS
   ============================================ */
import { onMounted, ref, computed } from 'vue'
import ReadingSessionItem from '../components/ReadingSessionItem.vue'
import ReadingSidebarCalendar from '../components/ReadingSidebarCalendar.vue'
import ReadingSidebarRanking from '../components/ReadingSidebarRanking.vue'
import ReadingSidebarEncyclopedia from '../components/ReadingSidebarEncyclopedia.vue'
import ReadingSidebarArticles from '../components/ReadingSidebarArticles.vue'
import ReadingSidebarCourses from '../components/ReadingSidebarCourses.vue'
import ReadingSidebarQRCode from '../components/ReadingSidebarQRCode.vue'
import SidebarFooter from '../components/SidebarFooter.vue'
import { useReadingClubStore } from '../stores/readingClub'

/* ============================================
   STORE / STATE MANAGEMENT
   ============================================ */
// Pinia store for reading club data (sessions, loading state, etc.)
const store = useReadingClubStore()

/* ============================================
   TOPIC TAGS DATA
   ============================================ */
// Array of research topic tags displayed in the tag cloud filter
// These represent different research areas in complex science
const topicTags = [
  'AI+Science',
  '因果涌现',
  '人工智能',
  '因果科学',
  '意识科学',
  '神经、认知、智能',
  '生命复杂性',
  '地球系统科学',
  '网络科学',
  '图神经网络',
  '复杂经济学',
  '计算社会科学',
  '复杂系统管理',
  '城市科学',
  '科学学',
]

/* ============================================
   REACTIVE STATE
   ============================================ */
// Currently selected tag (null means no filter, show all)
const selectedTag = ref<string | null>(null)

// Handle tag click - toggle selection (only one tag active at a time)
const handleTagClick = (tag: string, checked: boolean) => {
  if (checked) {
    // Select this tag (deselect any other)
    selectedTag.value = tag
  } else {
    // Deselect - show all items
    selectedTag.value = null
  }
}

// Filter sessions based on selected tag
const filteredSessions = computed(() => {
  if (!selectedTag.value) {
    // No tag selected - show all sessions
    return store.sessions
  }
  
  // Filter sessions that have the selected tag in their hashtags
  return store.sessions.filter(session => {
    // Check if any hashtag contains the selected tag (case-insensitive partial match)
    return session.hashtags.some(hashtag => 
      hashtag.toLowerCase().includes(selectedTag.value!.toLowerCase()) ||
      selectedTag.value!.toLowerCase().includes(hashtag.toLowerCase())
    )
  })
})

/* ============================================
   LIFECYCLE HOOKS
   ============================================ */
// Fetch reading club sessions when component mounts
onMounted(() => {
  store.fetchSessions()
})
</script>

<style scoped>
/* ============================================
   LAYOUT STRUCTURE
   ============================================ */

/* Main page layout: Two-column grid (main content + sidebar) */
.reading-layout {
  display: grid;
  grid-template-columns: 1fr 320px;  /* Main column flexible, sidebar fixed 320px */
  gap: 20px;                            /* Space between main column and sidebar */
  align-items: start;                   /* Align items to top */
  position: relative;                   /* For sticky positioning context */
}

/* Main content column: Contains page header and session list */
.main-column {
  display: flex;
  flex-direction: column;               /* Stack header and list vertically */
  gap: 0;                                /* No gap between header and list */
}

/* ============================================
   PAGE HEADER STYLES
   ============================================ */

/* Page header container: White background with description and tags */
.page-head {
  background: #fff;                     /* White background */
  padding: 20px 24px;                   /* Internal spacing */
  border-radius: 0;                     /* Sharp corners */
  margin-bottom: 0;                      /* No bottom margin (connects to session list) */
}

/* Main description text styling */
.page-description {
  margin: 0 0 12px;                      /* No top/left/right margin, 12px bottom */
  color: var(--swarma-text-primary);    /* Primary text color */
  font-size: 14px;                      /* Standard body text size */
  line-height: 1.6;                     /* Comfortable line spacing */
}

/* ============================================
   TAG CLOUD STYLES
   ============================================ */

/* Container for topic tags - flexbox with wrapping */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;                       /* Allow tags to wrap to next line */
  gap: 12px;                             /* Space between tags */
  margin-bottom: 0;                      /* No bottom margin */
}

/* Override Ant Design tag component styling to match image exactly */
.tag-cloud :deep(.ant-tag) {
  border-radius: 4px;                      /* Sharp corners (no rounding) */
  margin: 0;                             /* Remove default margins */
  background: #fff;                      /* White background */
  border: 1px solid var(--swarma-border); /* Thin subtle border (rgba(0, 0, 0, 0.15)) */
  color: var(--swarma-text-primary);     /* Dark gray text matching description */
  padding: 1px 9px;                     /* Consistent internal padding */
  font-size: 14px;                      /* Match description text size */
  line-height: 1.5;                     /* Comfortable line height */
}

/* Unchecked state styling (default state) */
.tag-cloud :deep(.ant-tag:not(.ant-tag-checkable-checked)) {
  background: #fff;                       /* White background */
  border-color: var(--swarma-border);
  color: var(--swarma-text-primary);
}

/* Checked state styling (when tag is selected) */
.tag-cloud :deep(.ant-tag-checkable-checked) {
  background: var(--swarma-primary);
  border-color: var(--swarma-primary);
  color: #fff;
}

/* ============================================
   SESSION LIST STYLES
   ============================================ */

/* Container for reading session items */
.session-list {
  padding: 0;                            /* No padding (items handle their own) */
  border-radius: 0;                      /* Sharp corners */
  box-shadow: none;                      /* No shadow (flat design) */
  background: #fff;                      /* White background */
}

/* Remove padding from Ant Design spin container */
.session-list :deep(.ant-spin-container) {
  padding: 0;                            /* No padding inside loading container */
}

/* End of list message */
.end-message {
  padding: 30px 20px;
  text-align: center;
  color: var(--swarma-text-secondary);
  font-size: 14px;
}

/* Hide divider on last item before end-message */
/* When end-message exists, the last session-item is the second-to-last child */
.session-list :deep(.ant-spin-container > .session-item:nth-last-child(2))::after {
  display: none !important;
}

/* ============================================
   SIDEBAR STYLES
   ============================================ */

/* Sidebar column: Calendar and ranking widgets */
/* Normal scroll behavior - sidebar scrolls with page, no sticky */
.sidebar-column {
  display: flex;
  flex-direction: column;                /* Stack widgets vertically */
  gap: 20px;                             /* Space between widgets */
  align-self: flex-start;                /* Align to top, don't stretch to match main column height */
}

/* ============================================
   RESPONSIVE / MOBILE STYLES
   ============================================ */

/* On tablets and smaller screens, switch to single column layout */
@media (max-width: 1024px) {
  /* Stack main content and sidebar vertically */
  .reading-layout {
    grid-template-columns: 1fr;          /* Single column layout */
  }

  /* Keep normal flow on mobile */
  .sidebar-column {
    align-self: flex-start;
  }
}
</style>

