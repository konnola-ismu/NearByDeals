import { useState, useMemo } from 'react'
import type { AppUser, Role, UserStatus, Deal } from '../types'

interface AdminPanelProps {
  users: AppUser[]
  deals: Deal[]
  isSupabaseLive: boolean
  onAddUserClick: () => void
  onToggleUserStatus: (userId: string, currentStatus: UserStatus) => Promise<void>
  onDeleteUser: (userId: string, userName: string) => Promise<void>
  onOpenSqlModal: () => void
  onRefreshData: () => Promise<void>
  onApproveDeal: (dealId: string | number) => void
  onDeleteDeal: (dealId: string | number) => void
}

export function AdminPanel({
  users,
  deals,
  isSupabaseLive,
  onAddUserClick,
  onToggleUserStatus,
  onDeleteUser,
  onOpenSqlModal,
  onRefreshData,
  onApproveDeal,
  onDeleteDeal,
}: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'All'>('All')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculations
  const totalUsers = users.length
  const totalCustomers = users.filter((u) => u.role === 'customer').length
  const totalMerchants = users.filter((u) => u.role === 'merchandiser').length
  const activeCount = users.filter((u) => u.status === 'active').length
  const inactiveCount = users.filter((u) => u.status === 'inactive').length

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (roleFilter !== 'All' && user.role !== roleFilter) return false
      if (statusFilter !== 'All' && user.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = user.name.toLowerCase().includes(q)
        const matchesEmail = user.email.toLowerCase().includes(q)
        const matchesPhone = user.phone.toLowerCase().includes(q)
        const matchesCity = user.city.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCity) return false
      }
      return true
    })
  }, [users, roleFilter, statusFilter, searchQuery])

  const handleToggle = async (user: AppUser) => {
    setActionLoadingId(user.id)
    try {
      await onToggleUserStatus(user.id, user.status)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (user: AppUser) => {
    if (window.confirm(`Are you sure you want to remove ${user.name} (${user.email}) from Supabase?`)) {
      setActionLoadingId(user.id)
      try {
        await onDeleteUser(user.id, user.name)
      } finally {
        setActionLoadingId(null)
      }
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefreshData()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="admin-panel-container">
      {/* Supabase Status Banner */}
      <div className={`supabase-status-banner ${isSupabaseLive ? 'live' : 'notice'}`}>
        <div className="status-banner-left">
          <span className="status-indicator-dot" />
          <div>
            <strong>
              {isSupabaseLive
                ? '⚡ Supabase Database Connected & Live (public.app_users)'
                : '⚡ Supabase Client Connected'}
            </strong>
            <p>
              {isSupabaseLive
                ? 'All user additions, status toggles, and deletions are saved directly to your Supabase PostgreSQL database in real time.'
                : 'Project URL & Anon Key are linked. Run the provided SQL script in your Supabase SQL Editor to initialize tables.'}
            </p>
          </div>
        </div>
        <div className="status-banner-actions">
          <button className="ghost-btn small-btn" onClick={onOpenSqlModal}>
            📋 View Supabase SQL Script
          </button>
          <button
            className="ghost-btn small-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? '↻ Refreshing...' : '↻ Refresh Sync'}
          </button>
        </div>
      </div>

      {/* Admin KPI Metrics Strip */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card positive">
          <div className="metric-icon">👥</div>
          <div>
            <span>Total Accounts</span>
            <strong>{totalUsers}</strong>
            <small>{totalCustomers} Customers • {totalMerchants} Merchants</small>
          </div>
        </div>

        <div className="admin-metric-card warning">
          <div className="metric-icon">✅</div>
          <div>
            <span>Active Users</span>
            <strong>{activeCount}</strong>
            <small>{Math.round((activeCount / (totalUsers || 1)) * 100)}% of userbase</small>
          </div>
        </div>

        <div className="admin-metric-card danger">
          <div className="metric-icon">⏸️</div>
          <div>
            <span>Inactive Users</span>
            <strong>{inactiveCount}</strong>
            <small>Access restricted</small>
          </div>
        </div>

        <div className="admin-metric-card neutral">
          <div className="metric-icon">🎟️</div>
          <div>
            <span>Live Deal Offers</span>
            <strong>{deals.length}</strong>
            <small>Active in directory</small>
          </div>
        </div>
      </div>

      {/* User & Customer Management Table */}
      <div className="panel-card admin-users-card">
        <div className="panel-header user-table-header">
          <div>
            <h3>User & Customer Management</h3>
            <p className="sub-description">
              Admin rights to add, remove, and toggle active/inactive status. Stored in Supabase.
            </p>
          </div>
          <button className="primary-btn pulse-glow" onClick={onAddUserClick}>
            + Add New User / Customer
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="table-filter-bar">
          <div className="search-field-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>

          <div className="filter-dropdowns">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | 'All')}
              className="table-select-filter"
            >
              <option value="All">All Roles ({totalUsers})</option>
              <option value="customer">Customers ({totalCustomers})</option>
              <option value="merchandiser">Merchandisers ({totalMerchants})</option>
              <option value="admin">Admins</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'All')}
              className="table-select-filter"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active ({activeCount})</option>
              <option value="inactive">Inactive ({inactiveCount})</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="responsive-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User / Customer</th>
                <th>Contact Info</th>
                <th>Role</th>
                <th>Location</th>
                <th>Status</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty-cell">
                    No users match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isLoading = actionLoadingId === user.id
                  const isActive = user.status === 'active'

                  return (
                    <tr key={user.id} className={!isActive ? 'row-inactive' : ''}>
                      <td>
                        <div className="user-profile-cell">
                          <div className={`user-avatar-circle ${user.role}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{user.name}</strong>
                            <small className="user-id-code">ID: {user.id.slice(0, 8)}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="user-contact-cell">
                          <span>{user.email}</span>
                          <small>{user.phone}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'customer' && '👤 Customer'}
                          {user.role === 'merchandiser' && '🏪 Merchandiser'}
                          {user.role === 'admin' && '⚡ Super Admin'}
                        </span>
                      </td>
                      <td>
                        <span className="city-cell">{user.city || 'Navi Mumbai'}</span>
                      </td>
                      <td>
                        <button
                          className={`status-toggle-pill ${isActive ? 'is-active' : 'is-inactive'}`}
                          onClick={() => handleToggle(user)}
                          disabled={isLoading}
                          title={`Click to ${isActive ? 'deactivate' : 'activate'} user`}
                        >
                          <span className="dot" />
                          {isLoading
                            ? 'Updating...'
                            : isActive
                            ? 'Active'
                            : 'Inactive'}
                        </button>
                      </td>
                      <td>
                        <div className="action-buttons-cell">
                          <button
                            className={`table-action-btn ${isActive ? 'deactivate-btn' : 'activate-btn'}`}
                            onClick={() => handleToggle(user)}
                            disabled={isLoading}
                            title={isActive ? 'Deactivate user' : 'Activate user'}
                          >
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="table-action-btn delete-btn"
                            onClick={() => handleDelete(user)}
                            disabled={isLoading}
                            title="Remove user from Supabase"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deal Moderation Section */}
      <div className="panel-card admin-moderation-card">
        <div className="panel-header">
          <div>
            <h3>Deal Moderation & Directory Oversight</h3>
            <p className="sub-description">
              Review hyper-local promotions published by store merchandisers before release.
            </p>
          </div>
          <span className="badge-pill neutral">{deals.length} Total Deals</span>
        </div>

        <div className="moderation-deals-grid">
          {deals.slice(0, 4).map((deal) => (
            <div key={deal.id} className="moderation-item-card">
              <div className="mod-card-top">
                <span className={`deal-accent-dot ${deal.accent}`} />
                <span className="mod-tag">{deal.tag}</span>
                <span className="mod-price">{deal.price}</span>
              </div>
              <h4>{deal.name}</h4>
              <p>{deal.title}</p>
              <div className="mod-card-meta">
                <span>{deal.category}</span>
                <span>{deal.distance}</span>
              </div>
              <div className="mod-actions">
                <button
                  className="review-btn"
                  onClick={() => onApproveDeal(deal.id)}
                >
                  ✓ Approve
                </button>
                <button
                  className="review-btn secondary"
                  onClick={() => onDeleteDeal(deal.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
