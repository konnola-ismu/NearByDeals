import { supabase } from '../lib/supabase'
import type { AppUser } from '../types'

const LOCAL_STORAGE_KEY = 'nearbydeals_users_cache'

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98201 12345',
    role: 'customer',
    status: 'active',
    city: 'Belapur, Navi Mumbai',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'usr-2',
    name: 'Priya Patel',
    email: 'priya.patel@cafebella.com',
    phone: '+91 98202 23456',
    role: 'merchandiser',
    status: 'active',
    city: 'Vashi, Navi Mumbai',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'usr-3',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@metromart.in',
    phone: '+91 98203 34567',
    role: 'merchandiser',
    status: 'active',
    city: 'Nerul, Navi Mumbai',
    created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
  {
    id: 'usr-4',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@example.com',
    phone: '+91 98204 45678',
    role: 'customer',
    status: 'inactive',
    city: 'Kharghar, Navi Mumbai',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'usr-5',
    name: 'Vikram Singh',
    email: 'admin.vikram@nearbydeals.in',
    phone: '+91 98205 56789',
    role: 'admin',
    status: 'active',
    city: 'CBD Belapur',
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: 'usr-6',
    name: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 98206 67890',
    role: 'customer',
    status: 'active',
    city: 'Panvel, Navi Mumbai',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
]

function getLocalUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Failed to parse cached users:', err)
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_USERS))
  return INITIAL_USERS
}

function saveLocalUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('Failed to cache users locally:', err)
  }
}

export interface FetchUsersResult {
  users: AppUser[]
  isSupabaseLive: boolean
  errorMessage?: string
}

export async function fetchUsers(): Promise<FetchUsersResult> {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      // Table might not exist yet in Supabase
      console.warn('Supabase fetch returned error (falling back to cache):', error.message)
      return {
        users: getLocalUsers(),
        isSupabaseLive: false,
        errorMessage: error.message,
      }
    }

    if (data && data.length > 0) {
      saveLocalUsers(data as AppUser[])
      return { users: data as AppUser[], isSupabaseLive: true }
    }

    // If table exists but is empty, try inserting initial seeds
    if (data && data.length === 0) {
      const { error: seedError } = await supabase.from('app_users').insert(INITIAL_USERS)
      if (!seedError) {
        return { users: INITIAL_USERS, isSupabaseLive: true }
      }
    }

    return { users: getLocalUsers(), isSupabaseLive: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      users: getLocalUsers(),
      isSupabaseLive: false,
      errorMessage: message,
    }
  }
}

export async function createUser(
  user: Omit<AppUser, 'id' | 'created_at'>
): Promise<{ user: AppUser; isSupabaseLive: boolean; error?: string }> {
  const newUser: AppUser = {
    ...user,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('app_users')
      .insert([newUser])
      .select()
      .single()

    if (!error && data) {
      const current = getLocalUsers()
      saveLocalUsers([data as AppUser, ...current])
      return { user: data as AppUser, isSupabaseLive: true }
    }

    // Fallback to local
    const current = getLocalUsers()
    saveLocalUsers([newUser, ...current])
    return { user: newUser, isSupabaseLive: false, error: error?.message }
  } catch (err: unknown) {
    const current = getLocalUsers()
    saveLocalUsers([newUser, ...current])
    const message = err instanceof Error ? err.message : String(err)
    return { user: newUser, isSupabaseLive: false, error: message }
  }
}

export async function updateUserStatus(
  userId: string,
  newStatus: 'active' | 'inactive'
): Promise<{ success: boolean; isSupabaseLive: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('app_users')
      .update({ status: newStatus })
      .eq('id', userId)

    const current = getLocalUsers().map((u) =>
      u.id === userId ? { ...u, status: newStatus } : u
    )
    saveLocalUsers(current)

    if (error) {
      return { success: true, isSupabaseLive: false, error: error.message }
    }

    return { success: true, isSupabaseLive: true }
  } catch (err: unknown) {
    const current = getLocalUsers().map((u) =>
      u.id === userId ? { ...u, status: newStatus } : u
    )
    saveLocalUsers(current)
    const message = err instanceof Error ? err.message : String(err)
    return { success: true, isSupabaseLive: false, error: message }
  }
}

export async function deleteUser(
  userId: string
): Promise<{ success: boolean; isSupabaseLive: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('app_users')
      .delete()
      .eq('id', userId)

    const current = getLocalUsers().filter((u) => u.id !== userId)
    saveLocalUsers(current)

    if (error) {
      return { success: true, isSupabaseLive: false, error: error.message }
    }

    return { success: true, isSupabaseLive: true }
  } catch (err: unknown) {
    const current = getLocalUsers().filter((u) => u.id !== userId)
    saveLocalUsers(current)
    const message = err instanceof Error ? err.message : String(err)
    return { success: true, isSupabaseLive: false, error: message }
  }
}
