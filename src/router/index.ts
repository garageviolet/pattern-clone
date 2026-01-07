import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/reading-club',
  },
  {
    path: '/reading-club',
    name: 'ReadingClub',
    component: () => import('../views/ReadingClubView.vue'),
  },
  {
    path: '/paths',
    name: 'Paths',
    component: () => import('../views/PathsView.vue'),
  },
  {
    path: '/papers',
    name: 'Papers',
    component: () => import('../views/PapersView.vue'),
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('../views/PlaceholderView.vue'),
    meta: { title: '文章' },
  },
  {
    path: '/publications',
    name: 'Publications',
    component: () => import('../views/PlaceholderView.vue'),
    meta: { title: '公号' },
  },
  {
    path: '/encyclopedia',
    name: 'Encyclopedia',
    component: () => import('../views/PlaceholderView.vue'),
    meta: { title: '百科' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

