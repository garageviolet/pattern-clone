<template>
  <div class="app-shell">
    <!-- Top Navigation Bar: Sticky header with logo, nav tabs, search, and login -->
    <header class="nav-shell">
      <div class="nav-inner">
        <!-- Left: Logo Section - Butterfly icon + "集智斑图 Swarma Pattern" text image -->
        <div class="logo">
          <img src="/logo-mark.png" class="logo-mark" alt="Swarma Icon" />
          <img src="/logo-text.png" class="logo-text" alt="Swarma Pattern" />
        </div>

        <!-- Center: Navigation Tabs - 读书会, 路径, 文章, 公众号, 论文, 百科 -->
        <nav>
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            active-class="nav-link--active"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <!-- Right: Search Bar + Login Button -->
        <div class="nav-actions">
          <!-- Search Input: "探索复杂科学" placeholder with search icon button -->
          <a-input-search
            v-model:value="searchValue"
            placeholder="探索复杂科学"
            size="middle"
            class="search-input"
          >
            <template #enterButton>
              <SearchOutlined />
            </template>
          </a-input-search>
          <!-- Login Button -->
          <a-button size="middle">登录</a-button>
        </div>
      </div>
    </header>

    <!-- Main Content Area: Router view renders page content (读书会, 路径, 论文, etc.) -->
    <main class="content-shell">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { SearchOutlined } from '@ant-design/icons-vue'

// Navigation menu items - displayed as tabs in center of header
const navItems = [
  { label: '读书会', path: '/reading-club' },
  { label: '路径', path: '/paths' },
  { label: '文章', path: '/articles' },
  { label: '公众号', path: '/publications' },
  { label: '论文', path: '/papers' },
  { label: '百科', path: '/encyclopedia' },
]

// Search input value binding
const searchValue = ref('')
</script>

<style scoped>
/* ============================================
   HEADER / NAVIGATION BAR STYLES
   ============================================ */

/* Sticky header container - stays at top when scrolling */
.nav-shell {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0; /* Sharp corners */
}

/* Inner nav container: 3-column grid (logo | nav tabs | search+login) */
.nav-inner {
  width: min(1680px, 100vw); /* Max width matches real site */
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto auto 1fr auto; /* Logo | Nav tabs | Flexible space | Actions */
  align-items: center;
  height: 65px; /* Header height */
  gap: 10px; /* Reduced spacing - logo close to tabs, tabs close to search */
  padding: 0 16px;
}

/* ============================================
   LOGO SECTION (Left)
   ============================================ */

.logo {
  display: flex;
  align-items: center;
  gap: 0px; /* Space between icon and text */
}

.logo-text {
  height: auto;
  width: auto;
  max-height: 42px; /* Match logo-mark height */
}

.logo-mark {
  height: 42px; /* Butterfly icon height */
  width: auto;
}

/* ============================================
   NAVIGATION TABS (Center)
   ============================================ */

nav {
  display: flex;
  gap: 10px; /* No gap between tabs */
  height: 100%;
  align-items: center;
  justify-content: flex-start; /* Tabs aligned to the left */
}

/* Individual nav tab link */
.nav-link {
  position: relative;
  padding: 0 10px; /* Horizontal padding for each tab */
  color: rgba(0, 0, 0, 0.85); /* Default text color */
  font-size: 16px; /* Tab font size */
  transition: color 0.3s ease;
  height: 100%;
  display: flex;
  align-items: center;
  border-radius: 0; /* Sharp corners */
}

/* Active tab underline indicator (blue bar at bottom) */
.nav-link::after {
  content: '';
  position: absolute;
  left: 10px; /* Match tab padding */
  right: 10px; /* Match tab padding */
  bottom: 0;
  height: 4px; /* Underline thickness */
  background: var(--swarma-primary); /* Blue color */
  transform: scaleX(0); /* Hidden by default */
  transform-origin: center;
  transition: transform 0.3s ease;
  border-radius: 0;
}

.nav-link:hover {
  color: black; /* Blue on hover */
}

/* Active/current page tab styling */
.nav-link--active {
  color: var(--swarma-primary); /* Blue text */
  font-weight: 700; /* Bold for active tab */
}

.nav-link--active::after {
  transform: scaleX(1); /* Show underline for active tab */
}

/* ============================================
   SEARCH BAR + LOGIN BUTTON (Right)
   ============================================ */

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px; /* Space between search and login button */
  justify-content: flex-end; /* Push search and login to the right */
}

/* Search input container - expanded to fill space and close gap to tabs */
.search-input {
  width: 100%; /* Expand to fill available space */
  max-width: 1000px; /* Max width limit */
}

/* Search input field styling */
.search-input :deep(.ant-input) {
  border-radius: 2; /* Sharp corners */
  height: 36px; /* Input height */
  font-size: 14px;
  background-color: #f5f5f5 !important; /* Light grey background */
  transition: border-color 0.2s;
}

/* Search input hover - blue border like login button */
.search-input :deep(.ant-input:hover),
.search-input :deep(.ant-input:focus) {
  border-color: var(--swarma-primary) !important;
}

/* Search button (magnifying glass icon) - solid blue with white icon */
.search-input :deep(.ant-input-search-button) {
  border-radius: 0; /* Sharp corners */
  height: 36px; /* Match input height */
  width: 36px; /* Square button */
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--swarma-primary) !important; /* Blue background */
  border-color: var(--swarma-primary) !important;
  color: #fff !important;
}

/* Make the search icon white */
.search-input :deep(.ant-input-search-button .anticon),
.search-input :deep(.ant-input-search-button svg) {
  color: #fff !important;
  fill: #fff !important;
}

.search-input :deep(.ant-input-search-button:hover) {
  background-color: rgba(0, 0, 0, 0.04) !important; /* Light grey background on hover */
  border-color: var(--swarma-primary) !important;
}

.search-input :deep(.ant-input-search-button:hover .anticon),
.search-input :deep(.ant-input-search-button:hover svg) {
  color: var(--swarma-primary) !important; /* Blue icon on hover */
  fill: var(--swarma-primary) !important;
}

/* Login button styling - blue border and text */
.nav-actions :deep(.ant-btn) {
  height: 36px; /* Match search bar height */
  padding: 0 20px;
  border-radius: 5px;
  font-size: 14px;
  color: var(--swarma-primary) !important; /* Blue text */
  border-color: var(--swarma-primary) !important; /* Blue border */
}

/* Login button hover */
.nav-actions :deep(.ant-btn:hover) {
  color: var(--swarma-primary) !important; /* Blue text on hover */
  border-color: var(--swarma-primary) !important; /* Blue border on hover */
  background: rgba(24, 144, 255, 0.05) !important; /* Light blue background on hover */
}

/* ============================================
   RESPONSIVE / MOBILE STYLES
   ============================================ */

@media (max-width: 768px) {
  .nav-inner {
    grid-template-columns: 1fr;
    height: auto;
    padding: 16px 0;
  }

  nav {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

