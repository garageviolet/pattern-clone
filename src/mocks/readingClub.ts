import type { ReadingClubSession } from '../types/content'

export const readingClubSessions: ReadingClubSession[] = [
  {
    id: 'session-001',
    title: '理论生态学读书会',
    countdown: '13 天后',
    cohortInfo: '共 10 期',
    membersInfo: '仅 1 位会友',
    dateRange: '起止时间：2025.12.07–2026.02',
    weeklySchedule: '每周日 14:00–16:00',
    tags: ['AI+Science', '复杂科学阅读'],
    hashtags: ['#复杂科学'],
    summary:
      '面向广大学研工作者的系列论文阅读活动，复杂科学前沿方向的学术社区。',
    cover:
      'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=640',
    link: '#',
    statusLabel: '上新',
    statusType: 'new',
  },
  {
    id: 'session-002',
    title: '走向意识科学：从现象之窗到理论之梯',
    countdown: '直播进行中 3/10期',
    cohortInfo: '3/10 期',
    membersInfo: ' 约 205 位会友',
    dateRange: '起止时间：2025.11.14–2026.01',
    weeklySchedule: '每周五 19:00–21:00',
    tags: ['意识科学', '神经科学'],
    hashtags: [
      '#神经科学',
      '#功能与计算',
      '#信息整合',
      '#因果涌现',
      '#预测加工',
    ],
    summary: '探索意识研究从哲学根基到神经科学实验的跨学科路线。',
    cover:
      'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=640',
    link: '#',
    statusLabel: '进行中',
    statusType: 'running',
  },
  {
    id: 'session-003',
    title: '非线性动力学与混沌',
    countdown: '直播进行中 7/12期',
    cohortInfo: '7/12 期',
    membersInfo: '约 136 位会友',
    dateRange: '起止时间：2025.10.09–2026.01',
    weeklySchedule: '每周四 19:30–21:30',
    tags: ['复杂动力学', '非线性'],
    hashtags: ['#混沌', '#涌现', '#复杂科学'],
    summary:
      '理解非线性系统的共性结构，从理论到仿真案例解析混沌世界的模式。',
    cover:
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=640',
    link: '#',
    statusLabel: '进行中',
    statusType: 'running',
  },
]

