// User types
export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

// Log types
export interface Log {
  id: string
  content: string
  date: Date
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  user?: User
  tags: Tag[]
  likes?: Like[]
  _count?: {
    likes: number
  }
}

export interface CreateLogInput {
  content: string
  date?: Date
  isPublic?: boolean
  tags?: string[]
}

export interface UpdateLogInput {
  content?: string
  date?: Date
  isPublic?: boolean
  tags?: string[]
}

// Tag types
export interface Tag {
  id: string
  name: string
}

// Article types
export interface Article {
  id: string
  title: string
  content: string
  sourceLogIds: string[]
  createdAt: Date
  userId: string
  user?: User
}

export interface GenerateArticleInput {
  logIds: string[]
  title?: string
  style?: 'tutorial' | 'blog' | 'documentation'
}

// Like types
export interface Like {
  id: string
  createdAt: Date
  userId: string
  logId: string
}

// Stats types
export interface MyStats {
  totalLogs: number
  currentStreak: number
  longestStreak: number
  thisWeekLogs: number
  weeklyGoal: number
  tagStats: TagStat[]
  recentActivity: DailyActivity[]
}

export interface TagStat {
  tag: string
  count: number
  percentage: number
}

export interface DailyActivity {
  date: string
  count: number
}

export interface CommunityStats {
  ranking: RankingEntry[]
  trendingTags: TrendingTag[]
  totalUsers: number
  totalPublicLogs: number
}

export interface RankingEntry {
  userId: string
  userName: string | null
  userImage: string | null
  streak: number
  totalLogs: number
  rank: number
}

export interface TrendingTag {
  tag: string
  count: number
  trend: 'up' | 'down' | 'stable'
}

// Search types
export interface SearchResult {
  logs: Log[]
  totalCount: number
  query: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  nextCursor?: string
  hasMore: boolean
  totalCount: number
}

// Filter types
export interface LogFilter {
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
  isPublic?: boolean
  sortBy?: 'date' | 'likes'
  sortOrder?: 'asc' | 'desc'
}
