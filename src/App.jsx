import React, { useState, useEffect, useRef } from 'react'
import {
  Heart, MapPin, Camera, Plus, Clock,
  Phone, X, Trophy, ChevronLeft, Star, Flame,
  Users, Leaf, Upload, AlertCircle, Moon, Loader
} from 'lucide-react'
import {
  uploadProofImage,
  uploadListingImage,
  fetchListings,
  insertListing,
  updateListingStatus,
  isSupabaseConfigured
} from './lib/supabase'

// ─── Mock data ───────────────────────────────────────────────────────────────
const MOCK_LISTINGS = [
  {
    id: 1,
    seller: 'Pak Mat Murtabak',
    location: 'Bazaar TTDI',
    item: 'Murtabak Daging Kambing',
    quantity: 12,
    posted_at: '19:45',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&w=400&q=80',
    category: 'food',
  },
  {
    id: 2,
    seller: 'Kak Som Drinks',
    location: 'Bazaar Kampung Baru',
    item: 'Air Katira & Bandung',
    quantity: 25,
    posted_at: '20:10',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&w=400&q=80',
    category: 'drinks',
  },
  {
    id: 3,
    seller: 'Ustaz Halim Kurma',
    location: 'Bazaar Masjid India',
    item: 'Kurma Ajwa Premium',
    quantity: 5,
    posted_at: '20:30',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1590080877897-f00f6cb15e24?auto=format&fit=crop&w=400&q=80',
    category: 'food',
  },
]

const CATEGORIES = ['All', 'Food', 'Drinks', 'Desserts', 'Snacks']

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const pieces = Array.from({ length: 28 })
  const colors = ['#22c55e', '#f97316', '#fbbf24', '#34d399', '#fb923c', '#86efac']
  const shapes = ['■', '●', '▲', '★']

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((_, i) => {
        const color = colors[i % colors.length]
        const shape = shapes[i % shapes.length]
        const left = `${Math.random() * 100}%`
        const delay = `${(i * 0.12).toFixed(2)}s`
        const duration = `${2.5 + Math.random() * 1.5}s`
        const size = `${10 + Math.random() * 10}px`

        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              left,
              top: '-20px',
              color,
              fontSize: size,
              animation: `confetti-fall ${duration} ${delay} ease-in forwards`,
            }}
          >
            {shape}
          </span>
        )
      })}
    </div>
  )
}

// ─── Floating particles ───────────────────────────────────────────────────────
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-barakah-400/30"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function Badge({ status, quantity }) {
  const map = {
    available: { label: `${quantity} left`, cls: 'bg-saffron-500/20 text-saffron-400 border border-saffron-500/30' },
    claimed: { label: 'Pending proof', cls: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    completed: { label: 'Rescued ✓', cls: 'bg-barakah-600/20 text-barakah-400 border border-barakah-600/30' },
  }
  const { label, cls } = map[status] || map.available
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  )
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-[#111a11] rounded-2xl p-4 flex gap-4 card-glow animate-pulse">
      <div className="w-20 h-20 rounded-xl bg-white/5" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-white/5 rounded-full w-16" />
        <div className="h-4 bg-white/5 rounded-full w-32" />
        <div className="h-3 bg-white/5 rounded-full w-24" />
        <div className="h-8 bg-white/5 rounded-lg mt-2" />
      </div>
    </div>
  )
}

// ─── Impact ring ──────────────────────────────────────────────────────────────
function ImpactRing({ value, max, label }) {
  const pct = Math.min(value / max, 1)
  const circumference = 2 * Math.PI * 28
  const dash = pct * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#1a2e1a" strokeWidth="5" />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="#22c55e"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-barakah-400">
          {Math.round(pct * 100)}%
        </span>
      </div>
      <span className="text-[10px] text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  )
}

// ─── Listing card ─────────────────────────────────────────────────────────────
function ListingCard({ item, onView, onUpload }) {
  const [pressed, setPressed] = useState(false)
  const done = item.status === 'completed'
  const claimed = item.status === 'claimed'

  return (
    <div
      className={`
        bg-[#111a11] rounded-2xl p-4 flex gap-4 card-glow
        transition-all duration-200 ease-out
        ${done ? 'opacity-40 grayscale' : 'hover:bg-[#162216]'}
        ${pressed ? 'scale-[0.98]' : 'scale-100'}
      `}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <div className="relative shrink-0">
        <img
          src={item.image_url}
          alt={item.item}
          className="w-20 h-20 rounded-xl object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=60' }}
        />
        {item.status === 'available' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-saffron-500 animate-pulse-glow" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <Badge status={item.status} quantity={item.quantity} />
          <span className="text-[10px] text-white/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.posted_at || '—'}
          </span>
        </div>

        <h3 className="font-display text-white font-bold text-sm leading-tight truncate pr-2">
          {item.item}
        </h3>
        <p className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{item.seller} · {item.location}</span>
        </p>

        {!done && (
          <button
            onClick={() => claimed ? onUpload(item) : onView(item)}
            className={`
              mt-2.5 w-full py-2 rounded-xl text-xs font-bold btn-press
              ${claimed
                ? 'border border-blue-500/40 text-blue-400 hover:bg-blue-500/10'
                : 'bg-barakah-700 hover:bg-barakah-600 text-white shadow-lg shadow-barakah-900/50'}
              transition-all
            `}
          >
            {claimed
              ? <span className="flex items-center justify-center gap-1.5"><Camera className="w-3 h-3" /> Upload Proof</span>
              : 'Sedekah →'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('home')
  const [listings, setListings] = useState(MOCK_LISTINGS)
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState(null)
  const [stats, setStats] = useState({ meals: 12450, bazaars: 42, co2: 3.7 })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [filter, setFilter] = useState('All')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [proofUrl, setProofUrl] = useState(null)
  const [newListingImg, setNewListingImg] = useState(null)
  const [barakahPoints, setBarakahPoints] = useState(0)
  const [streakDays, setStreakDays] = useState(7)
  const proofInputRef = useRef()
  const listingImgRef = useRef()
  const formRef = useRef()

  // Load listings from Supabase (falls back to mock)
  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchListings()
      if (data && data.length > 0) setListings(data)
      setLoading(false)
    }
    load()
  }, [])

  // Closing-time notice at 3s
  useEffect(() => {
    const t = setTimeout(() => {
      setNotice({
        type: 'warning',
        icon: '🌙',
        title: 'Closing Soon — 10:00 PM',
        body: 'Help rescue remaining meals before bazaar closes!',
      })
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  // Auto-dismiss notice
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 7000)
    return () => clearTimeout(t)
  }, [notice])

  const filtered = filter === 'All'
    ? listings
    : listings.filter(l => l.category?.toLowerCase() === filter.toLowerCase())

  const available = listings.filter(l => l.status === 'available').length
  const rescued = listings.filter(l => l.status === 'completed').length

  // ── Post surplus
  async function handlePostSurplus(e) {
    e.preventDefault()
    setSubmitting(true)

    const fd = new FormData(formRef.current)
    let imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'

    if (newListingImg) {
      const { url } = await uploadListingImage(newListingImg)
      if (url) imageUrl = url
    }

    const newItem = {
      id: Date.now(),
      seller: fd.get('seller') || 'Anonymous Vendor',
      location: fd.get('location') || 'Your Bazaar',
      item: fd.get('item'),
      quantity: parseInt(fd.get('quantity')),
      posted_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'available',
      image_url: imageUrl,
      category: fd.get('category') || 'food',
    }

    // Try inserting to Supabase
    const inserted = await insertListing(newItem)
    if (inserted) {
      setListings(prev => [inserted, ...prev])
    } else {
      setListings(prev => [newItem, ...prev])
    }

    setNotice({ type: 'success', icon: '✅', title: 'Listed!', body: `"${newItem.item}" is now live for rescue.` })
    setSubmitting(false)
    setNewListingImg(null)
    setPreviewUrl(null)
    formRef.current?.reset()
    setView('home')
  }

  // ── Claim
  async function claimItem(id) {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'claimed' } : l))
    await updateListingStatus(id, 'claimed')
    setView('home')
    setNotice({ type: 'info', icon: '👐', title: 'Item Claimed!', body: 'Upload proof of redistribution to earn Barakah points.' })
  }

  // ── Submit proof
  async function submitProof(id) {
    if (!proofInputRef.current?.files?.[0] && !proofUrl) {
      setNotice({ type: 'error', icon: '📷', title: 'Photo Required', body: 'Please capture a proof photo first.' })
      return
    }

    setSubmitting(true)

    if (proofInputRef.current?.files?.[0]) {
      const { url } = await uploadProofImage(proofInputRef.current.files[0], id)
      if (!url) {
        setNotice({ type: 'error', icon: '⚠️', title: 'Upload Failed', body: 'Try again or check your connection.' })
        setSubmitting(false)
        return
      }
    }

    await updateListingStatus(id, 'completed')
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'completed' } : l))
    setStats(prev => ({ ...prev, meals: prev.meals + 1, co2: +(prev.co2 + 0.4).toFixed(1) }))
    setBarakahPoints(prev => prev + 50)
    setSubmitting(false)
    setProofUrl(null)
    setView('success')
    setConfetti(true)
    setTimeout(() => setConfetti(false), 4500)
  }

  // ── Image preview handlers
  function handleListingImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setNewListingImg(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleProofCapture(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setProofUrl(URL.createObjectURL(file))
  }

  // ─── Shared header
  function Header() {
    return (
      <header className="relative bg-gradient-to-b from-[#0d1f0d] to-[#0a150a] px-5 pt-10 pb-6 overflow-hidden">
        <FloatingParticles />

        {/* top bar */}
        <div className="relative flex items-center justify-between mb-6">
          <div>
            <p className="text-barakah-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-0.5">
              بركة — Ramadan Food Rescue
            </p>
            <h1 className="font-display text-3xl font-black text-white leading-none">
              Barakah<span className="text-barakah-400">Byte</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-barakah-700/30 border border-barakah-600/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-saffron-400 fill-saffron-400" />
              <span className="text-xs font-bold text-white">{barakahPoints}</span>
            </div>
            <div className="bg-saffron-500/20 border border-saffron-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-saffron-400" />
              <span className="text-xs font-bold text-white">{streakDays}d</span>
            </div>
          </div>
        </div>

        {/* stats row */}
        <div className="relative grid grid-cols-3 gap-2">
          {[
            { value: stats.meals.toLocaleString(), label: 'Meals Saved', icon: Heart },
            { value: `${stats.co2}kg`, label: 'CO₂ Avoided', icon: Leaf },
            { value: stats.bazaars, label: 'Bazaars', icon: Users },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-white/5 backdrop-blur rounded-2xl p-3 text-center border border-white/5">
              <Icon className="w-3.5 h-3.5 text-barakah-400 mx-auto mb-1" />
              <p className="text-lg font-black text-white leading-none">{value}</p>
              <p className="text-[9px] text-white/40 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </header>
    )
  }

  // ─── Toast notification
  function Toast() {
    if (!notice) return null
    const colors = {
      warning: 'border-saffron-500/30 bg-saffron-950/80',
      success: 'border-barakah-500/30 bg-barakah-950/80',
      info: 'border-blue-500/30 bg-blue-950/80',
      error: 'border-red-500/30 bg-red-950/80',
    }
    return (
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div
          className={`
            pointer-events-auto
            max-w-sm w-full backdrop-blur-xl border rounded-2xl p-4
            flex items-start gap-3 shadow-2xl
            animate-notification-in
            ${colors[notice.type] || colors.info}
          `}
        >
          <span className="text-2xl leading-none mt-0.5">{notice.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">{notice.title}</p>
            <p className="text-xs text-white/60 mt-0.5">{notice.body}</p>
          </div>
          <button onClick={() => setNotice(null)} className="text-white/30 hover:text-white/70 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // ─── Home view
  function HomeView() {
    return (
      <>
        <Header />
        <main className="p-4 space-y-5">
          {/* Live indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-saffron-500" />
              </span>
              <span className="text-sm font-bold text-white/80">{available} available now</span>
            </div>
            <span className="text-xs text-white/30">{rescued} rescued tonight</span>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap btn-press
                  transition-all
                  ${filter === cat
                    ? 'bg-barakah-700 text-white shadow-lg shadow-barakah-900/50'
                    : 'bg-white/5 text-white/40 hover:text-white/70 border border-white/10'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Waste progress bar */}
          <div className="bg-[#111a11] rounded-2xl p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-white/80">Tonight's Rescue Progress</p>
                <p className="text-[10px] text-white/30 mt-0.5">Goal: zero food waste at closing</p>
              </div>
              <Leaf className="w-4 h-4 text-barakah-400" />
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-barakah-600 to-barakah-400 rounded-full transition-all duration-1000 shimmer-bg"
                style={{ width: `${rescued > 0 ? Math.min((rescued / (rescued + available)) * 100, 100) : 18}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-white/30">{rescued} rescued</span>
              <span className="text-[9px] text-white/30">{available} remaining</span>
            </div>
          </div>

          {/* Listing cards */}
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Moon className="w-10 h-10 text-white/20 mx-auto" />
                <p className="text-white/30 text-sm">Nothing in this category yet</p>
                <button
                  onClick={() => setView('post')}
                  className="text-barakah-400 text-sm font-bold underline underline-offset-4"
                >
                  + Post surplus
                </button>
              </div>
            ) : (
              filtered.map(item => (
                <ListingCard
                  key={item.id}
                  item={item}
                  onView={item => { setSelected(item); setView('details') }}
                  onUpload={item => { setSelected(item); setView('proof') }}
                />
              ))
            )}
          </div>
        </main>
      </>
    )
  }

  // ─── Details view
  function DetailsView() {
    if (!selected) return null
    return (
      <div className="animate-slide-up">
        <div className="relative">
          <img
            src={selected.image_url}
            alt={selected.item}
            className="w-full h-56 object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-transparent to-transparent" />
          <button
            onClick={() => setView('home')}
            className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white p-2.5 rounded-full border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge status={selected.status} quantity={selected.quantity} />
              <span className="text-[10px] text-white/30">{selected.posted_at}</span>
            </div>
            <h2 className="font-display text-2xl font-black text-white">{selected.item}</h2>
            <p className="text-white/50 text-sm mt-1">{selected.seller} · {selected.location}</p>
          </div>

          {/* Why sedekah box */}
          <div className="bg-barakah-950/60 border border-barakah-800/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-barakah-400" />
              <span className="text-xs font-bold text-barakah-400 uppercase tracking-wider">Why this matters</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Every rescued meal prevents food waste, reduces CO₂, and earns you <strong className="text-white">50 Barakah points</strong>. In Ramadan, even a small act of sedekah is multiplied.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="tel:+60123456789"
              className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 btn-press hover:bg-white/10 transition-all"
            >
              <Phone className="w-4 h-4 text-barakah-400" /> Call Seller
            </a>
            <button
              onClick={() => claimItem(selected.id)}
              className="w-full bg-barakah-700 hover:bg-barakah-600 text-white p-4 rounded-2xl font-bold text-sm shadow-lg shadow-barakah-900/60 btn-press transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              Claim & Rescue This
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Post surplus view
  function PostView() {
    return (
      <div className="animate-slide-up">
        <div className="bg-gradient-to-b from-[#0d1f0d] to-[#0a150a] px-5 pt-10 pb-5">
          <button onClick={() => setView('home')} className="text-barakah-400 text-sm font-bold mb-4 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="font-display text-3xl font-black text-white">Post Surplus</h2>
          <p className="text-white/40 text-sm mt-1">Help your leftover food find a home</p>
        </div>

        <form ref={formRef} onSubmit={handlePostSurplus} className="p-5 space-y-4">
          {/* Image upload */}
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Food Photo</label>
            <div
              onClick={() => listingImgRef.current?.click()}
              className="relative bg-[#111a11] border-2 border-dashed border-barakah-800/60 rounded-2xl aspect-video flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-barakah-600/60 transition-colors overflow-hidden"
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-white/20" />
                  <p className="text-xs text-white/30 font-bold">Tap to upload photo</p>
                </>
              )}
            </div>
            <input
              ref={listingImgRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleListingImageChange}
              className="hidden"
            />
          </div>

          {/* Fields */}
          {[
            { name: 'item', placeholder: 'Food item (e.g. Nasi Ayam)', required: true, label: 'Item Name' },
            { name: 'seller', placeholder: 'Your stall name', label: 'Stall Name' },
            { name: 'location', placeholder: 'Bazaar location', label: 'Location' },
          ].map(f => (
            <div key={f.name}>
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">{f.label}</label>
              <input
                name={f.name}
                required={f.required}
                placeholder={f.placeholder}
                className="w-full bg-[#111a11] border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-barakah-600/60 transition-colors"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Quantity</label>
              <input
                name="quantity"
                type="number"
                required
                placeholder="e.g. 15"
                min="1"
                className="w-full bg-[#111a11] border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-barakah-600/60 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Category</label>
              <select
                name="category"
                className="w-full bg-[#111a11] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-barakah-600/60 transition-colors appearance-none"
              >
                {['food', 'drinks', 'desserts', 'snacks'].map(c => (
                  <option key={c} value={c} className="bg-[#111a11]">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {!isSupabaseConfigured && (
            <div className="bg-saffron-950/40 border border-saffron-800/30 rounded-xl p-3 flex gap-2.5">
              <AlertCircle className="w-4 h-4 text-saffron-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-saffron-300/70">Supabase not configured – data will be stored locally this session only.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-barakah-700 hover:bg-barakah-600 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-barakah-900/60 btn-press transition-all mt-2"
          >
            {submitting ? 'Listing...' : 'List for Rescue 🌙'}
          </button>
        </form>
      </div>
    )
  }

  // ─── Upload proof view
  function ProofView() {
    if (!selected) return null
    return (
      <div className="animate-slide-up">
        <div className="bg-gradient-to-b from-[#0d1f0d] to-[#0a150a] px-5 pt-10 pb-5">
          <button onClick={() => setView('home')} className="text-barakah-400 text-sm font-bold mb-4 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="font-display text-3xl font-black text-white">Proof of Good Deed</h2>
          <p className="text-white/40 text-sm mt-1">Photo closes the loop & earns 50 Barakah points</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Capture area */}
          <div
            onClick={() => proofInputRef.current?.click()}
            className="relative bg-[#111a11] border-2 border-dashed border-blue-700/40 rounded-3xl aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-600/60 transition-colors overflow-hidden"
          >
            {proofUrl ? (
              <>
                <img src={proofUrl} alt="proof" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity gap-2">
                  <Camera className="w-8 h-8 text-white" />
                  <p className="text-xs text-white font-bold">Retake</p>
                </div>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 text-blue-400/50" />
                <div className="text-center">
                  <p className="font-bold text-white/60 text-sm">Tap to capture</p>
                  <p className="text-[11px] text-white/30 mt-1">Photo at mosque or with recipient</p>
                </div>
              </>
            )}
          </div>
          <input
            ref={proofInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleProofCapture}
            className="hidden"
          />

          {/* Tip */}
          <div className="bg-blue-950/40 border border-blue-800/30 rounded-xl p-3 flex gap-2.5">
            <Star className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-300/70">Best photos: hand-off moment, mosque distribution, or happy recipients. Blurry photos are okay!</p>
          </div>

          <button
            onClick={() => submitProof(selected.id)}
            disabled={submitting}
            className="w-full bg-barakah-700 hover:bg-barakah-600 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-barakah-900/60 btn-press transition-all"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" /> Verifying...
              </span>
            ) : 'Submit Proof & Earn 50 pts'}
          </button>
        </div>
      </div>
    )
  }

  // ─── Success view
  function SuccessView() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6 animate-pop">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-barakah-500/20 animate-ping scale-150" />
          <div className="relative bg-barakah-800/40 rounded-full p-8 border border-barakah-600/30">
            <Trophy className="w-16 h-16 text-saffron-400" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-arabic text-3xl text-barakah-400">الحمد لله</p>
          <h2 className="font-display text-4xl font-black text-white">Alhamdulillah!</h2>
        </div>

        <p className="text-white/60 max-w-xs leading-relaxed">
          Loop closed. You saved food, reduced waste, and earned
          <span className="text-saffron-400 font-bold"> +50 Barakah points</span>.
          <br />
          May your act be multiplied this Ramadan. 🌙
        </p>

        {/* Points display */}
        <div className="bg-[#111a11] border border-barakah-800/40 rounded-2xl px-8 py-4 flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-saffron-400">{barakahPoints}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Barakah Points</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-black text-barakah-400">{streakDays}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Day Streak</p>
          </div>
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={() => setView('home')}
            className="w-full bg-barakah-700 hover:bg-barakah-600 text-white py-4 rounded-2xl font-bold btn-press shadow-lg shadow-barakah-900/60 transition-all"
          >
            Rescue More Food
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'BarakahByte',
                  text: `I just rescued food and earned ${barakahPoints} Barakah points! Zero waste, maximum barakah 🌙`,
                  url: window.location.href,
                })
              }
            }}
            className="w-full bg-white/5 border border-white/10 text-white/70 py-3 rounded-2xl font-bold text-sm btn-press hover:bg-white/10 transition-all"
          >
            Share My Impact 🌿
          </button>
        </div>
      </div>
    )
  }

  // ─── Bottom nav
  function BottomNav() {
    const tabs = [
      { id: 'home', icon: MapPin, label: 'Discover' },
      { id: 'post', icon: Plus, label: 'Post', center: true },
      { id: 'success', icon: Heart, label: 'My Impact' },
    ]
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
        <div className="w-full max-w-md bg-[#0a0f0a]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-6 py-3 pb-safe">
          {tabs.map(({ id, icon: Icon, label, center }) => {
            const active = view === id
            if (center) return (
              <button
                key={id}
                onClick={() => setView(id)}
                className="bg-barakah-700 hover:bg-barakah-600 text-white p-4 rounded-2xl -mt-8 shadow-2xl shadow-barakah-900/80 btn-press border border-barakah-600/40 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            )
            return (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-barakah-400' : 'text-white/30 hover:text-white/50'}`}
              >
                <Icon className={`w-5 h-5 ${active ? 'fill-barakah-400 stroke-barakah-400' : ''}`} />
                <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    )
  }

  // ─── Render
  return (
    <div className="min-h-screen bg-[#0a0f0a] font-body text-white max-w-md mx-auto relative overflow-x-hidden">
      <Confetti active={confetti} />
      <Toast />

      <div className={`pb-24 ${['home', 'post', 'details', 'proof'].includes(view) ? '' : ''}`}>
        {view === 'home' && <HomeView />}
        {view === 'post' && <PostView />}
        {view === 'details' && <DetailsView />}
        {view === 'proof' && <ProofView />}
        {view === 'success' && <SuccessView />}
      </div>

      {view !== 'success' && <BottomNav />}
    </div>
  )
}