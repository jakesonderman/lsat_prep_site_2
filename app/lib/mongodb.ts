import { MongoClient } from 'mongodb'

// Default URI for build time (will be replaced by actual URI at runtime)
const uri = process.env.MONGODB_URI || 'mongodb://placeholder-for-build-time'

// Only throw error in development, not during build
if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'development') {
  console.warn('MongoDB URI not found. Please add your MongoDB URI to .env.local')
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Skip actual connection during build time
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build'

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise 