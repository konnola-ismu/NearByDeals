import './App.css'

const categories = ['Dining', 'Retail', 'Supermarkets', 'Services']
const dealTypes = ['Flash Sale', 'Limited Time', 'Weekend Pick', 'New']

const deals = [
  {
    id: 1,
    name: 'Café Bella',
    category: 'Dining',
    tag: '48% off',
    distance: '0.8 km',
    time: 'Ends in 6h',
    title: 'Sunset dinner combo',
    price: '₹799',
    original: '₹1499',
    accent: 'peach',
  },
  {
    id: 2,
    name: 'Metro Mart',
    category: 'Supermarkets',
    tag: 'Hot Deal',
    distance: '1.4 km',
    time: 'Ends in 9h',
    title: 'Groceries + essentials',
    price: '₹649',
    original: '₹1199',
    accent: 'mint',
  },
  {
    id: 3,
    name: 'Urban Threads',
    category: 'Retail',
    tag: 'Flash Sale',
    distance: '2.1 km',
    time: 'Ends in 4h',
    title: 'Fashion picks under ₹999',
    price: '₹999',
    original: '₹2199',
    accent: 'violet',
  },
  {
    id: 4,
    name: 'QuickFix Auto',
    category: 'Services',
    tag: 'Limited Time',
    distance: '3.7 km',
    time: 'Ends in 12h',
    title: 'Basic service package',
    price: '₹1299',
    original: '₹2499',
    accent: 'blue',
  },
]

const expiringDeals = [
  { name: 'Mango Bistro', time: '18:30', discount: 'Buy 1 Get 1', kind: 'Dining' },
  { name: 'Nexa Home', time: '20:15', discount: 'Up to 40% off', kind: 'Retail' },
  { name: 'Fresh Basket', time: '21:45', discount: 'Free delivery', kind: 'Supermarket' },
]

const merchantStats = [
  { label: 'Impressions', value: '18.4K', trend: '+22%' },
  { label: 'Clicks', value: '3.2K', trend: '+18%' },
  { label: 'WhatsApp taps', value: '860', trend: '+31%' },
  { label: 'Route requests', value: '410', trend: '+12%' },
]

const adminMetrics = [
  { label: 'Pending approvals', value: '28', tone: 'warning' },
  { label: 'Active merchants', value: '1,240', tone: 'positive' },
  { label: 'Featured placements', value: '86', tone: 'neutral' },
  { label: 'Expired offers', value: '33', tone: 'danger' },
]

function App() {
  return (
    <div className="nearbydeals-app">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-badge">N</div>
          <div>
            <div className="brand-name">NearByDeals</div>
            <div className="brand-subtitle">Local offers, faster</div>
          </div>
        </div>

        <nav className="nav">
          <a href="#discover">Discover</a>
          <a href="#merchant">Merchant</a>
          <a href="#admin">Admin</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="topbar-actions">
          <button className="ghost-btn">Log in</button>
          <button className="primary-btn">List a deal</button>
        </div>
      </header>

      <main className="page-shell">
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
              <div className="search-input">Search dining, retail, services...</div>
              <button className="search-button">Search deals</button>
            </div>

            <div className="filter-row">
              {categories.map((category) => (
                <button key={category} className="chip">
                  {category}
                </button>
              ))}
            </div>

            <div className="filter-row secondary">
              {dealTypes.map((type) => (
                <button key={type} className="chip muted-chip">
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
                <div className="map-pin pin-one">C</div>
                <div className="map-pin pin-two">M</div>
                <div className="map-pin pin-three">S</div>
                <div className="map-pin pin-four">R</div>
              </div>
            </div>

            <div className="mini-stat-card">
              <span className="mini-label">Live today</span>
              <strong>15 deals</strong>
              <small>Updated 2 min ago</small>
            </div>
          </div>
        </section>

        <section id="discover" className="content-grid">
          <div className="deals-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow small-eyebrow">Nearby deals</span>
                <h2>Popular in your area</h2>
              </div>
              <button className="text-button">View all</button>
            </div>

            <div className="deal-list">
              {deals.map((deal) => (
                <article key={deal.id} className={`deal-card ${deal.accent}`}>
                  <div className="deal-image">
                    <span className="deal-tag">{deal.tag}</span>
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
                        <span>{deal.original}</span>
                      </div>
                      <span className="expiring-label">{deal.time}</span>
                    </div>

                    <div className="deal-actions">
                      <button className="action-btn call">Call</button>
                      <button className="action-btn whatsapp">WhatsApp</button>
                      <button className="action-btn route">Directions</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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
                <strong>14</strong>
              </div>
              <div className="metric-item highlight">
                <span>Favorites</span>
                <strong>9</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className="stats-strip">
          <div className="stat-box">
            <span>Merchant reach</span>
            <strong>120K+</strong>
          </div>
          <div className="stat-box">
            <span>Avg. conversion</span>
            <strong>4.8%</strong>
          </div>
          <div className="stat-box">
            <span>Map route clicks</span>
            <strong>7.2K</strong>
          </div>
          <div className="stat-box">
            <span>Listings approved</span>
            <strong>96%</strong>
          </div>
        </section>

        <section id="merchant" className="role-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow small-eyebrow">Merchant dashboard</span>
              <h2>Promote offers with live analytics</h2>
            </div>
          </div>

          <div className="role-card-grid">
            <div className="dashboard-panel panel-card">
              <div className="panel-header">
                <span>Performance overview</span>
                <button className="ghost-btn small-btn">This month</button>
              </div>

              <div className="mini-sparkline">
                <span className="bar one" />
                <span className="bar two" />
                <span className="bar three" />
                <span className="bar four" />
                <span className="bar five" />
                <span className="bar six" />
                <span className="bar seven" />
              </div>

              <div className="metric-row">
                {merchantStats.map((stat) => (
                  <div key={stat.label} className="merchant-metric">
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <small>{stat.trend}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="promo-panel panel-card">
              <div className="panel-header">
                <span>Active promotions</span>
                <button className="primary-btn small-btn">Create offer</button>
              </div>

              <ul className="promo-list">
                <li>
                  <div>
                    <strong>Weekend Special</strong>
                    <small>All branches</small>
                  </div>
                  <span className="status good">Live</span>
                </li>
                <li>
                  <div>
                    <strong>Flash Lunch Deal</strong>
                    <small>Belapur branch</small>
                  </div>
                  <span className="status good">Live</span>
                </li>
                <li>
                  <div>
                    <strong>Family Combo</strong>
                    <small>Awaiting review</small>
                  </div>
                  <span className="status pending">Pending</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="admin" className="role-section admin-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow small-eyebrow">Super admin</span>
              <h2>Control center and moderation</h2>
            </div>
          </div>

          <div className="admin-grid">
            <div className="admin-metrics">
              {adminMetrics.map((item) => (
                <div key={item.label} className={`admin-box ${item.tone}`}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="moderation-panel panel-card">
              <div className="panel-header">
                <span>Moderation queue</span>
                <button className="ghost-btn small-btn">Review all</button>
              </div>

              <ul className="moderation-list">
                <li>
                  <div>
                    <strong>Metro Mart Promo</strong>
                    <small>Submitted 18 mins ago</small>
                  </div>
                  <button className="review-btn">Approve</button>
                </li>
                <li>
                  <div>
                    <strong>Urban Threads</strong>
                    <small>Needs category fix</small>
                  </div>
                  <button className="review-btn secondary">Review</button>
                </li>
                <li>
                  <div>
                    <strong>QuickFix Auto</strong>
                    <small>Pending escalation</small>
                  </div>
                  <button className="review-btn secondary">Audit</button>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
