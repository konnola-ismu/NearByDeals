export type Role = 'customer' | 'merchandiser' | 'admin'
export type UserStatus = 'active' | 'inactive'

export interface AppUser {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  status: UserStatus
  city: string
  avatar?: string
  created_at: string
}

export type DealCategory = 'Dining' | 'Retail' | 'Supermarkets' | 'Services'
export type DealAccent = 'peach' | 'mint' | 'violet' | 'blue'
export type DealStatus = 'active' | 'pending' | 'paused' | 'expired'

export interface Deal {
  id: number | string
  name: string
  title: string
  category: DealCategory
  tag: string
  price: string
  original: string
  distance: string
  time: string
  accent: DealAccent
  status?: DealStatus
  merchant_id?: string
  impressions?: number
  clicks?: number
  claims?: number
  created_at?: string
}

export interface ExpiringDeal {
  name: string
  time: string
  discount: string
  kind: string
}

export interface MerchantStat {
  label: string
  value: string
  trend: string
}

export interface AdminMetric {
  label: string
  value: string
  tone: 'warning' | 'positive' | 'neutral' | 'danger'
}
