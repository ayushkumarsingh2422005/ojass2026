import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Kick off initial connection when this module is imported so routes don't need to
// call `connectToDatabase()` on every request. This starts the connection once
// per Node process. Keep exporting the function for compatibility.
// Start initial connection and export the connection promise so routes can await it
const _connectPromise = connectToDatabase().then((conn) => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log('MongoDB: initial connection established');
  }
  return conn;
}).catch((err) => {
  // Log but do not crash the import — route handlers may handle transient errors.
  // eslint-disable-next-line no-console
  console.error('MongoDB: initial connection error', err);
  // rethrow so awaiting code can handle it
  throw err;
});

// Export the promise so callers can await the initial connection if needed
export const connectPromise = _connectPromise;

export default connectToDatabase;

