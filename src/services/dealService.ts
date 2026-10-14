import { supabase } from '../lib/supabase'
import type { Deal } from '../types'

const LOCAL_STORAGE_KEY = 'nearbydeals_deals_cache'

export const INITIAL_DEALS: Deal[] = [
  {
    id: 1,
    name: 'Café Bella',
    category: 'Dining',
    tag: '48% off',
    distance: '0.8 km',
    time: 'Ends in 6h',
    title: 'Sunset dinner combo for two',
    price: '₹799',
    original: '₹1499',
    accent: 'peach',
    status: 'active',
    merchant_id: 'usr-2',
    impressions: 4820,
    clicks: 1240,
    claims: 86,
  },
  {
    id: 2,
    name: 'Metro Mart',
    category: 'Supermarkets',
    tag: 'Hot Deal',
    distance: '1.4 km',
    time: 'Ends in 9h',
    title: 'Weekend pantry & dairy combo box',
    price: '₹649',
    original: '₹1199',
    accent: 'mint',
    status: 'active',
    merchant_id: 'usr-3',
    impressions: 8940,
    clicks: 2150,
    claims: 194,
  },
  {
    id: 3,
    name: 'Urban Threads',
    category: 'Retail',
    tag: 'Flash Sale',
    distance: '2.1 km',
    time: 'Ends in 4h',
    title: 'Curated fashion picks under ₹999',
    price: '₹999',
    original: '₹2199',
    accent: 'violet',
    status: 'active',
    merchant_id: 'usr-2',
    impressions: 3120,
    clicks: 860,
    claims: 52,
  },
  {
    id: 4,
    name: 'QuickFix Auto',
    category: 'Services',
    tag: 'Limited Time',
    distance: '3.7 km',
    time: 'Ends in 12h',
    title: 'Car deep spa & synthetic oil service',
    price: '₹1299',
    original: '₹2499',
    accent: 'blue',
    status: 'active',
    merchant_id: 'usr-3',
    impressions: 2210,
    clicks: 530,
    claims: 31,
  },
  {
    id: 5,
    name: 'Spice Valley Bistro',
    category: 'Dining',
    tag: 'BOGO Offer',
    distance: '1.1 km',
    time: 'Ends in 7h',
    title: 'Buy 1 Biryani Get 1 Free Appetizer',
    price: '₹349',
    original: '₹699',
    accent: 'peach',
    status: 'pending',
    merchant_id: 'usr-2',
    impressions: 0,
    clicks: 0,
    claims: 0,
  },
]

function getLocalDeals(): Deal[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Failed to parse cached deals:', err)
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEALS))
  return INITIAL_DEALS
}

function saveLocalDeals(deals: Deal[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deals))
  } catch (err) {
    console.error('Failed to cache deals locally:', err)
  }
}

export async function fetchDeals(): Promise<{ deals: Deal[]; isSupabaseLive: boolean }> {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('id', { ascending: true })

    if (error || !data) {
      return { deals: getLocalDeals(), isSupabaseLive: false }
    }

    if (data.length > 0) {
      saveLocalDeals(data as Deal[])
      return { deals: data as Deal[], isSupabaseLive: true }
    }

    return { deals: getLocalDeals(), isSupabaseLive: true }
  } catch {
    return { deals: getLocalDeals(), isSupabaseLive: false }
  }
}

export async function createDeal(
  dealData: Omit<Deal, 'id'>
): Promise<{ deal: Deal; isSupabaseLive: boolean }> {
  const newDeal: Deal = {
    ...dealData,
    id: Date.now(),
    impressions: 0,
    clicks: 0,
    claims: 0,
    status: 'active',
  }

  try {
    const { data, error } = await supabase
      .from('deals')
      .insert([newDeal])
      .select()
      .single()

    if (!error && data) {
      const current = getLocalDeals()
      saveLocalDeals([data as Deal, ...current])
      return { deal: data as Deal, isSupabaseLive: true }
    }
  } catch (err) {
    console.warn('Supabase insert deal failed, saving locally:', err)
  }

  const current = getLocalDeals()
  saveLocalDeals([newDeal, ...current])
  return { deal: newDeal, isSupabaseLive: false }
}

export async function updateDealStatus(
  dealId: number | string,
  status: Deal['status']
): Promise<void> {
  try {
    await supabase.from('deals').update({ status }).eq('id', dealId)
  } catch (err) {
    console.warn('Supabase update deal status error:', err)
  }

  const current = getLocalDeals().map((d) => (d.id === dealId ? { ...d, status } : d))
  saveLocalDeals(current)
}

export async function deleteDeal(dealId: number | string): Promise<void> {
  try {
    await supabase.from('deals').delete().eq('id', dealId)
  } catch (err) {
    console.warn('Supabase delete deal error:', err)
  }

  const current = getLocalDeals().filter((d) => d.id !== dealId)
  saveLocalDeals(current)
}
