import { useState } from 'react'
import type { Deal, MerchantStat } from '../types'

interface MerchantPanelProps {
  deals: Deal[]
  merchantStats: MerchantStat[]
  onOpenCreateDeal: () => void
  onToggleDealStatus: (dealId: string | number, currentStatus: Deal['status']) => void
  onDeleteDeal: (dealId: string | number) => void
}

export function MerchantPanel({
  deals,
  merchantStats,
  onOpenCreateDeal,
  onToggleDealStatus,
  onDeleteDeal,
}: MerchantPanelProps) {
  const [filterCategory, setFilterCategory] = useState<string>('All')

  const merchantDeals = deals.filter((d) =>
    filterCategory === 'All' ? true : d.category === filterCategory
  )

  return (
    <div className="merchant-panel-container">
      {/* Merchant Header Banner */}
      <div className="panel-hero-banner merchant-hero">
        <div className="banner-content">
          <span className="eyebrow small-eyebrow">Merchandiser Hub</span>
          <h2>Merchant Dashboard & Campaign Manager</h2>
          <p>
            Create instant flash discounts, drive foot traffic to your physical store,
            and monitor live customer engagement across WhatsApp and in-store claims.
          </p>
        </div>
        <div className="banner-cta">
          <button className="primary-btn pulse-glow" onClick={onOpenCreateDeal}>
            ✨ + Create New Deal
          </button>
        </div>
      </div>

      {/* Analytics & Performance */}
      <div className="role-card-grid">
        <div className="dashboard-panel panel-card">
          <div className="panel-header">
            <span>Weekly Engagement Overview</span>
            <span className="badge-pill positive">+24% vs Last Week</span>
          </div>

          <div className="mini-sparkline">
            <span className="bar one" title="Mon: 46%" />
            <span className="bar two" title="Tue: 68%" />
            <span className="bar three" title="Wed: 58%" />
            <span className="bar four" title="Thu: 82%" />
            <span className="bar five" title="Fri: 76%" />
            <span className="bar six" title="Sat: 100%" />
            <span className="bar seven" title="Sun: 87%" />
          </div>

          <div className="metric-row">
            {merchantStats.map((stat) => (
              <div key={stat.label} className="merchant-metric">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.trend} increase</small>
              </div>
            ))}
          </div>
        </div>

        <div className="store-profile-panel panel-card">
          <div className="panel-header">
            <span>Store Profile & Reach</span>
            <span className="badge-pill verified">Verified Partner</span>
          </div>

          <div className="merchant-info-card">
            <div className="merchant-avatar">🏪</div>
            <div>
              <h4>NearBy Partner Network</h4>
              <p>Navi Mumbai Cluster (Belapur, Vashi, Nerul)</p>
              <div className="merchant-tags">
                <span className="tag-pill">Dining</span>
                <span className="tag-pill">Retail</span>
                <span className="tag-pill">Supermarkets</span>
              </div>
            </div>
          </div>

          <div className="merchant-quick-actions">
            <div className="quick-action-item">
              <span>Average Voucher Conversion</span>
              <strong>18.4%</strong>
            </div>
            <div className="quick-action-item">
              <span>Customer Rating</span>
              <strong>4.9 ★ (820 reviews)</strong>
            </div>
          </div>

          <button className="ghost-btn full-width" onClick={onOpenCreateDeal}>
            + Post Hyper-Local Promotion
          </button>
        </div>
      </div>

      {/* Active Deals Management Table */}
      <div className="panel-card deals-management-card">
        <div className="panel-header table-header-flex">
          <div>
            <h3>Your Live Offers & Promotions ({merchantDeals.length})</h3>
            <p className="sub-description">
              Manage your store deals in real time. Deals sync to customer apps immediately.
            </p>
          </div>
          <div className="filter-controls">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="table-select-filter"
            >
              <option value="All">All Categories</option>
              <option value="Dining">Dining</option>
              <option value="Retail">Retail</option>
              <option value="Supermarkets">Supermarkets</option>
              <option value="Services">Services</option>
            </select>
            <button className="primary-btn small-btn" onClick={onOpenCreateDeal}>
              + New Deal
            </button>
          </div>
        </div>

        <div className="responsive-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Deal Title & Store</th>
                <th>Category</th>
                <th>Pricing</th>
                <th>Discount Tag</th>
                <th>Validity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchantDeals.map((deal) => {
                const isActive = deal.status !== 'paused'
                return (
                  <tr key={deal.id}>
                    <td>
                      <div className="table-deal-cell">
                        <span className={`deal-accent-dot ${deal.accent}`} />
                        <div>
                          <strong>{deal.name}</strong>
                          <small>{deal.title}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="chip-cell">{deal.category}</span>
                    </td>
                    <td>
                      <div className="table-price-cell">
                        <span className="price-bold">{deal.price}</span>
                        {deal.original && <del>{deal.original}</del>}
                      </div>
                    </td>
                    <td>
                      <span className="deal-tag-pill">{deal.tag}</span>
                    </td>
                    <td>
                      <span className="time-cell">{deal.time}</span>
                    </td>
                    <td>
                      <span className={`status-pill ${isActive ? 'active' : 'inactive'}`}>
                        {isActive ? '● Live' : '○ Paused'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-cell">
                        <button
                          className={`table-action-btn ${isActive ? 'pause-btn' : 'resume-btn'}`}
                          onClick={() => onToggleDealStatus(deal.id, deal.status)}
                          title={isActive ? 'Pause deal' : 'Resume deal'}
                        >
                          {isActive ? 'Pause' : 'Resume'}
                        </button>
                        <button
                          className="table-action-btn delete-btn"
                          onClick={() => onDeleteDeal(deal.id)}
                          title="Delete deal"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
