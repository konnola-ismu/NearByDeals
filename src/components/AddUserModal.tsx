import { useState } from 'react'
import type { AppUser, Role, UserStatus } from '../types'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAddUser: (user: Omit<AppUser, 'id' | 'created_at'>) => Promise<void>
}

export function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<Role>('customer')
  const [status, setStatus] = useState<UserStatus>('active')
  const [city, setCity] = useState('Belapur, Navi Mumbai')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Please provide both name and email.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await onAddUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+91 98000 00000',
        role,
        status,
        city: city.trim() || 'Navi Mumbai',
      })
      setName('')
      setEmail('')
      setPhone('')
      setRole('customer')
      setStatus('active')
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Add New User / Customer</h3>
            <p className="modal-subtext">User profile will be stored in Supabase (public.app_users)</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="modal-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                required
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98200 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Account Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="customer">Customer (Shopper)</option>
                <option value="merchandiser">Merchandiser (Merchant)</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label>Initial Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as UserStatus)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location / City</label>
            <input
              type="text"
              placeholder="e.g. Vashi, Navi Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="ghost-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Saving to Supabase...' : 'Save User to Supabase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
