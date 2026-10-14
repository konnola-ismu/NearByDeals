import type { Role } from '../types'

interface NavbarProps {
  currentRole: Role
  onSelectRole: (role: Role) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onOpenSqlModal: () => void
  isSupabaseLive: boolean
}

export function Navbar({
  currentRole,
  onSelectRole,
  theme,
  onToggleTheme,
  onOpenSqlModal,
  isSupabaseLive,
}: NavbarProps) {
  return (
    <header className="topbar">
      <div className="brand-wrap" onClick={() => onSelectRole('customer')} style={{ cursor: 'pointer' }}>
        <div className="brand-badge">N</div>
        <div>
          <div className="brand-name">NearByDeals</div>
          <div className="brand-subtitle">Local offers, faster</div>
        </div>
      </div>

      {/* Role Navigation Switcher */}
      <nav className="role-switcher-nav" aria-label="Role switcher">
        <button
          className={`role-tab-btn ${currentRole === 'customer' ? 'active' : ''}`}
          onClick={() => onSelectRole('customer')}
        >
          <span className="role-icon">👤</span>
          <span className="role-text">Customer View</span>
        </button>

        <button
          className={`role-tab-btn ${currentRole === 'merchandiser' ? 'active' : ''}`}
          onClick={() => onSelectRole('merchandiser')}
        >
          <span className="role-icon">🏪</span>
          <span className="role-text">Merchandiser Hub</span>
        </button>

        <button
          className={`role-tab-btn ${currentRole === 'admin' ? 'active' : ''}`}
          onClick={() => onSelectRole('admin')}
        >
          <span className="role-icon">⚡</span>
          <span className="role-text">Admin Center</span>
          <span className="admin-status-badge">Full Rights</span>
        </button>
      </nav>

      {/* Topbar Actions */}
      <div className="topbar-actions">
        <button
          className="supabase-pill-btn"
          onClick={onOpenSqlModal}
          title="Supabase Database Status & Setup Script"
        >
          <span className={`db-status-dot ${isSupabaseLive ? 'live' : 'ready'}`} />
          <span>Supabase SQL</span>
        </button>

        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}
