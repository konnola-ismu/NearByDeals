import { useState } from 'react'
import type { Deal, DealCategory, DealAccent } from '../types'

interface CreateDealModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateDeal: (deal: Omit<Deal, 'id'>) => Promise<void>
}

export function CreateDealModal({ isOpen, onClose, onCreateDeal }: CreateDealModalProps) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<DealCategory>('Dining')
  const [tag, setTag] = useState('40% OFF')
  const [price, setPrice] = useState('₹499')
  const [original, setOriginal] = useState('₹899')
  const [distance, setDistance] = useState('1.2 km')
  const [time, setTime] = useState('Ends in 8h')
  const [accent, setAccent] = useState<DealAccent>('peach')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !title.trim()) return

    setLoading(true)
    try {
      await onCreateDeal({
        name: name.trim(),
        title: title.trim(),
        category,
        tag: tag.trim() || 'Special Offer',
        price: price.trim().startsWith('₹') ? price.trim() : `₹${price.trim()}`,
        original: original.trim().startsWith('₹') ? original.trim() : `₹${original.trim()}`,
        distance: distance.trim() || 'Nearby',
        time: time.trim() || 'Limited Time',
        accent,
        status: 'active',
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Create New Deal</h3>
            <p className="modal-subtext">Publish a hyper-local deal to attract nearby customers</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Business / Brand Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Copper Chimney Bistro"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as DealCategory)}>
                <option value="Dining">Dining</option>
                <option value="Retail">Retail</option>
                <option value="Supermarkets">Supermarkets</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Offer Headline / Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Unlimited Lunch Buffet + Dessert"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label>Deal Price *</label>
              <input
                type="text"
                required
                placeholder="₹499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Original Price</label>
              <input
                type="text"
                placeholder="₹899"
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Badge Tag</label>
              <input
                type="text"
                placeholder="e.g. 50% OFF"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label>Distance / Area</label>
              <input
                type="text"
                placeholder="1.2 km"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Expiry Countdown</label>
              <input
                type="text"
                placeholder="Ends in 6h"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Color Accent</label>
              <select value={accent} onChange={(e) => setAccent(e.target.value as DealAccent)}>
                <option value="peach">Peach (Orange/Pink)</option>
                <option value="mint">Mint (Emerald)</option>
                <option value="violet">Violet (Purple)</option>
                <option value="blue">Blue (Indigo)</option>
              </select>
            </div>
          </div>

          <div className="deal-preview-box">
            <div className="preview-label">Live Customer Preview</div>
            <div className={`deal-card ${accent} preview-card`}>
              <div className="deal-image">
                <span className="deal-tag">{tag || 'DEAL'}</span>
              </div>
              <div className="deal-body">
                <div className="deal-topline">
                  <span>{category}</span>
                  <span>{distance || 'Nearby'}</span>
                </div>
                <h3>{name || 'Your Business Name'}</h3>
                <p>{title || 'Your enticing deal description goes here'}</p>
                <div className="deal-meta">
                  <div className="price-block">
                    <strong>{price || '₹0'}</strong>
                    <span>{original || ''}</span>
                  </div>
                  <span className="expiring-label">{time || 'Limited Time'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="ghost-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
