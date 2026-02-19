import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback for local dev without .env
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(url, key)

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

/**
 * Upload a proof image to Supabase Storage
 * Returns the public URL or null on failure
 */
export async function uploadProofImage(file, listingId) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Using mock upload.')
    return { url: URL.createObjectURL(file), error: null }
  }

  const ext = file.name.split('.').pop()
  const fileName = `proof_${listingId}_${Date.now()}.${ext}`
  const filePath = `proofs/${fileName}`

  const { error } = await supabase.storage
    .from('barakahbyte')
    .upload(filePath, file, { upsert: false })

  if (error) return { url: null, error }

  const { data } = supabase.storage
    .from('barakahbyte')
    .getPublicUrl(filePath)

  return { url: data.publicUrl, error: null }
}

/**
 * Upload a listing image to Supabase Storage
 */
export async function uploadListingImage(file) {
  if (!isSupabaseConfigured) {
    return { url: URL.createObjectURL(file), error: null }
  }

  const ext = file.name.split('.').pop()
  const fileName = `listing_${Date.now()}.${ext}`
  const filePath = `listings/${fileName}`

  const { error } = await supabase.storage
    .from('barakahbyte')
    .upload(filePath, file, { upsert: false })

  if (error) return { url: null, error }

  const { data } = supabase.storage
    .from('barakahbyte')
    .getPublicUrl(filePath)

  return { url: data.publicUrl, error: null }
}

/**
 * Fetch all listings from Supabase (or null if not configured)
 */
export async function fetchListings() {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch listings error:', error)
    return null
  }

  return data
}

/**
 * Insert a new listing
 */
export async function insertListing(listing) {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('listings')
    .insert([listing])
    .select()
    .single()

  if (error) {
    console.error('Insert listing error:', error)
    return null
  }

  return data
}

/**
 * Update listing status
 */
export async function updateListingStatus(id, status) {
  if (!isSupabaseConfigured) return null

  const { error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Update listing error:', error)
  }
}
