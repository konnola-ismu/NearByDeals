import { useState, useMemo } from 'react'
import type { Deal, ExpiringDeal, DealCategory } from '../types'

interface CustomerPanelProps {
  deals: Deal[]
  expiringDeals: ExpiringDeal[]
  onClaimDeal: (deal: Deal) => void
}

const categories: (DealCategory | 'All')[] = ['All', 'Dining', 'Retail', 'Supermarkets', 'Services']
const dealTypes = ['All Deals', 'Flash Sale', 'Limited Time', 'Weekend Pick', 'New']

export function CustomerPanel({ deals, expiringDeals, onClaimDeal }: CustomerPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<DealCategory | 'All'>('All')
  const [selectedType, setSelectedType] = useState('All Deals')
  const [savedDealIds, setSavedDealIds] = useState<Set<string | number>>(new Set([1]))
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all')

  const toggleSaveDeal = (id: string | number) => {
    setSavedDealIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      if (activeTab === 'saved' && !savedDealIds.has(deal.id)) return false
      if (selectedCategory !== 'All' && deal.category !== selectedCategory) return false
      if (selectedType !== 'All Deals' && !deal.tag.toLowerCase().includes(selectedType.toLowerCase())) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = deal.name.toLowerCase().includes(q)
        const matchesTitle = deal.title.toLowerCase().includes(q)
        const matchesCat = deal.category.toLowerCase().includes(q)
        if (!matchesName && !matchesTitle && !matchesCat) return false
      }
      return true
    })
  }, [deals, selectedCategory, selectedType, searchQuery, activeTab, savedDealIds])

  return (
    <div className="customer-panel-container">
      {/* Hero Section */}
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Hyper-local promotions</span>
          <h1>Find the best local deals before they expire.</h1>
          <p>
            Discover restaurant discounts, retail flash sales, and service offers
            around your location in real time.
          </p>

          <div className="search-box">
            <div className="search-location">
              <span>📍</span>
              <span>Belapur, Navi Mumbai</span>
            </div>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search dining, retail, services, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              className="search-button"
              onClick={() => {
                const el = document.getElementById('discover-deals')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Search deals
            </button>
          </div>

          <div className="filter-row">
            {categories.map((category) => (
              <button
                key={category}
                className={`chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="filter-row secondary">
            {dealTypes.map((type) => (
              <button
                key={type}
                className={`chip muted-chip ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="map-card">
            <div className="map-header">
              <span>Nearby map</span>
              <span className="distance-pill">Within 5 km</span>
            </div>
            <div className="map-grid">
              <div className="map-pin pin-one" title="Café Bella">C</div>
              <div className="map-pin pin-two" title="Metro Mart">M</div>
              <div className="map-pin pin-three" title="QuickFix Auto">S</div>
              <div className="map-pin pin-four" title="Urban Threads">R</div>
            </div>
          </div>

          <div className="mini-stat-card">
            <span className="mini-label">Live today</span>
            <strong>{deals.length} active deals</strong>
            <small>Updated just now</small>
          </div>
        </div>
      </section>

      {/* Main Deals Feed & Sidebar */}
      <section id="discover-deals" className="content-grid">
        <div className="deals-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow small-eyebrow">Customer Feed</span>
              <h2>{activeTab === 'saved' ? 'Your Saved Deals' : 'Popular in your area'}</h2>
            </div>
            <div className="tab-pill-group">
              <button
                className={`tab-pill ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Deals ({deals.length})
              </button>
              <button
                className={`tab-pill ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                ★ Saved ({savedDealIds.size})
              </button>
            </div>
          </div>

          {filteredDeals.length === 0 ? (
            <div className="empty-state-box">
              <span className="empty-icon">🔍</span>
              <h3>No matching deals found</h3>
              <p>Try resetting filters or searching for something else.</p>
              <button
                className="ghost-btn"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                  setSelectedType('All Deals')
                  setActiveTab('all')
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="deal-list">
              {filteredDeals.map((deal) => {
                const isSaved = savedDealIds.has(deal.id)
                return (
                  <article key={deal.id} className={`deal-card ${deal.accent}`}>
                    <div className="deal-image">
                      <span className="deal-tag">{deal.tag}</span>
                      <button
                        className={`save-bookmark-btn ${isSaved ? 'saved' : ''}`}
                        onClick={() => toggleSaveDeal(deal.id)}
                        title={isSaved ? 'Remove from saved' : 'Save deal'}
                        aria-label="Save deal"
                      >
                        {isSaved ? '★' : '☆'}
                      </button>
                    </div>

                    <div className="deal-body">
                      <div className="deal-topline">
                        <span>{deal.category}</span>
                        <span>{deal.distance}</span>
                      </div>

                      <h3>{deal.name}</h3>
                      <p>{deal.title}</p>

                      <div className="deal-meta">
                        <div className="price-block">
                          <strong>{deal.price}</strong>
                          {deal.original && <span>{deal.original}</span>}
                        </div>
                        <span className="expiring-label">{deal.time}</span>
                      </div>

                      <button
                        className="claim-voucher-btn"
                        onClick={() => onClaimDeal(deal)}
                      >
                        🎟️ Claim Voucher
                      </button>

                      <div className="deal-actions">
                        <a
                          href="tel:+919820112345"
                          className="action-btn call"
                          title="Call merchant"
                        >
                          📞 Call
                        </a>
                        <a
                          href={`https://wa.me/919820112345?text=${encodeURIComponent(
                            `Hi ${deal.name}, I'm interested in your deal: ${deal.title} on NearByDeals!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn whatsapp"
                          title="WhatsApp merchant"
                        >
                          💬 WhatsApp
                        </a>
                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn route"
                          title="Get directions"
                        >
                          📍 Directions
                        </a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <aside className="sidebar-panel">
          <div className="expiring-box">
            <div className="section-heading compact">
              <div>
                <span className="eyebrow small-eyebrow">Expiring soon</span>
                <h2>Last chance deals</h2>
              </div>
            </div>

            <div className="expiring-list">
              {expiringDeals.map((item) => (
                <div className="expiring-item" key={item.name}>
                  <div className="expiring-dot" />
                  <div className="expiring-copy">
                    <strong>{item.name}</strong>
                    <small>{item.kind}</small>
                  </div>
                  <div className="expiring-time-wrap">
                    <span>{item.time}</span>
                    <em>{item.discount}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="side-metrics">
            <div className="metric-item highlight">
              <span>Saved deals</span>
              <strong>{savedDealIds.size}</strong>
            </div>
            <div className="metric-item highlight">
              <span>Available offers</span>
              <strong>{deals.length}</strong>
            </div>
          </div>

          <div className="customer-tip-card">
            <h4>💡 Customer Tip</h4>
            <p>
              Show your digital voucher code at any listed merchant checkout to get instant discounts!
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}
