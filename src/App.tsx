import { useState, useEffect, useCallback } from 'react'
import './App.css'
import type { Role, AppUser, Deal, ExpiringDeal, MerchantStat, UserStatus } from './types'
import { fetchUsers, createUser, updateUserStatus, deleteUser } from './services/userService'
import { fetchDeals, createDeal, updateDealStatus, deleteDeal } from './services/dealService'
import { Navbar } from './components/Navbar'
import { CustomerPanel } from './components/CustomerPanel'
import { MerchantPanel } from './components/MerchantPanel'
import { AdminPanel } from './components/AdminPanel'
import { AddUserModal } from './components/AddUserModal'
import { CreateDealModal } from './components/CreateDealModal'
import { ClaimDealModal } from './components/ClaimDealModal'
import { SqlSchemaModal } from './components/SqlSchemaModal'

const expiringDeals: ExpiringDeal[] = [
  { name: 'Mango Bistro', time: '18:30', discount: 'Buy 1 Get 1', kind: 'Dining' },
  { name: 'Nexa Home', time: '20:15', discount: 'Up to 40% off', kind: 'Retail' },
  { name: 'Fresh Basket', time: '21:45', discount: 'Free delivery', kind: 'Supermarkets' },
  { name: 'Aroma Spa', time: '22:00', discount: 'Flat ₹500 off', kind: 'Services' },
]

const merchantStats: MerchantStat[] = [
  { label: 'Impressions', value: '18.4K', trend: '+22%' },
  { label: 'Clicks', value: '3.2K', trend: '+18%' },
  { label: 'WhatsApp taps', value: '860', trend: '+31%' },
  { label: 'Claims', value: '410', trend: '+14%' },
]

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nearbydeals-theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [currentRole, setCurrentRole] = useState<Role>('customer')
  const [users, setUsers] = useState<AppUser[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [isSupabaseLive, setIsSupabaseLive] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false)
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false)
  const [selectedDealForClaim, setSelectedDealForClaim] = useState<Deal | null>(null)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3800)
  }, [])

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('nearbydeals-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  // Load initial data
  const loadData = useCallback(async () => {
    const userResult = await fetchUsers()
    setUsers(userResult.users)
    setIsSupabaseLive(userResult.isSupabaseLive)

    const dealResult = await fetchDeals()
    setDeals(dealResult.deals)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Admin user operations
  const handleAddUser = async (newUserData: Omit<AppUser, 'id' | 'created_at'>) => {
    const result = await createUser(newUserData)
    setUsers((prev) => [result.user, ...prev])
    if (result.isSupabaseLive) {
      showToast(`✓ User ${result.user.name} saved directly to Supabase!`)
    } else {
      showToast(`✓ User ${result.user.name} added (cached locally until Supabase SQL run)`)
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: UserStatus) => {
    const nextStatus: UserStatus = currentStatus === 'active' ? 'inactive' : 'active'
    await updateUserStatus(userId, nextStatus)
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    )
    showToast(`✓ User status updated to ${nextStatus.toUpperCase()} in Supabase`)
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    await deleteUser(userId)
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    showToast(`✓ Removed ${userName} from database`)
  }

  // Merchandiser deal operations
  const handleCreateDeal = async (newDealData: Omit<Deal, 'id'>) => {
    const result = await createDeal(newDealData)
    setDeals((prev) => [result.deal, ...prev])
    showToast(`✓ Deal "${result.deal.name}" published successfully!`)
  }

  const handleToggleDealStatus = async (dealId: string | number, currentStatus: Deal['status']) => {
    const nextStatus = currentStatus === 'paused' ? 'active' : 'paused'
    await updateDealStatus(dealId, nextStatus)
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, status: nextStatus } : d))
    )
    showToast(`✓ Deal marked as ${nextStatus === 'active' ? 'LIVE' : 'PAUSED'}`)
  }

  const handleDeleteDeal = async (dealId: string | number) => {
    await deleteDeal(dealId)
    setDeals((prev) => prev.filter((d) => d.id !== dealId))
    showToast(`✓ Deal deleted`)
  }

  const handleApproveDeal = (dealId: string | number) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, status: 'active' } : d))
    )
    showToast(`✓ Deal approved and live in customer directory`)
  }

  return (
    <div className="nearbydeals-app">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="floating-toast">
          <span>{toastMessage}</span>
          <button className="toast-close" onClick={() => setToastMessage(null)}>
            ✕
          </button>
        </div>
      )}

      {/* Topbar Navigation */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        isSupabaseLive={isSupabaseLive}
      />

      {/* Main Panel View based on Active Role */}
      <main className="page-shell">
        {currentRole === 'customer' && (
          <CustomerPanel
            deals={deals}
            expiringDeals={expiringDeals}
            onClaimDeal={(deal) => setSelectedDealForClaim(deal)}
          />
        )}

        {currentRole === 'merchandiser' && (
          <MerchantPanel
            deals={deals}
            merchantStats={merchantStats}
            onOpenCreateDeal={() => setIsCreateDealOpen(true)}
            onToggleDealStatus={handleToggleDealStatus}
            onDeleteDeal={handleDeleteDeal}
          />
        )}

        {currentRole === 'admin' && (
          <AdminPanel
            users={users}
            deals={deals}
            isSupabaseLive={isSupabaseLive}
            onAddUserClick={() => setIsAddUserOpen(true)}
            onToggleUserStatus={handleToggleUserStatus}
            onDeleteUser={handleDeleteUser}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
            onRefreshData={loadData}
            onApproveDeal={handleApproveDeal}
            onDeleteDeal={handleDeleteDeal}
          />
        )}
      </main>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
      />

      <CreateDealModal
        isOpen={isCreateDealOpen}
        onClose={() => setIsCreateDealOpen(false)}
        onCreateDeal={handleCreateDeal}
      />

      <ClaimDealModal
        deal={selectedDealForClaim}
        onClose={() => setSelectedDealForClaim(null)}
      />

      <SqlSchemaModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  )
}

export default App
