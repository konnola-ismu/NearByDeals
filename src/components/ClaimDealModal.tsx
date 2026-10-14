import { useState } from 'react'
import type { Deal } from '../types'

interface ClaimDealModalProps {
  deal: Deal | null
  onClose: () => void
}

export function ClaimDealModal({ deal, onClose }: ClaimDealModalProps) {
  const [copied, setCopied] = useState(false)

  if (!deal) return null

  const couponCode = `NEARBY-${deal.name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}${Math.floor(
    1000 + Math.random() * 9000
  )}`

  const handleCopy = () => {
    navigator.clipboard?.writeText(couponCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container voucher-modal" onClick={(e) => e.stopPropagation()}>
        <div className="voucher-banner">
          <span className="voucher-badge">🎉 Deal Claimed!</span>
          <h3>{deal.name}</h3>
          <p>{deal.title}</p>
        </div>

        <div className="voucher-body">
          <div className="voucher-details-grid">
            <div>
              <span className="v-label">Special Price</span>
              <strong className="v-price">{deal.price}</strong>
            </div>
            <div>
              <span className="v-label">Discount</span>
              <span className="v-tag">{deal.tag}</span>
            </div>
            <div>
              <span className="v-label">Validity</span>
              <span className="v-time">{deal.time}</span>
            </div>
          </div>

          <div className="coupon-code-box">
            <span className="coupon-hint">Show this code at the merchant checkout:</span>
            <div className="coupon-row">
              <span className="coupon-code">{couponCode}</span>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          <div className="voucher-actions">
            <a
              href={`https://wa.me/919820112345?text=${encodeURIComponent(
                `Hi ${deal.name}, I claimed voucher ${couponCode} for ${deal.title} on NearByDeals!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn whatsapp full-width"
            >
              📲 Send Voucher to Merchant on WhatsApp
            </a>
            <button className="ghost-btn full-width" onClick={onClose}>
              Done & Return to Deals
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
