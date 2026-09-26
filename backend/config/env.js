import dotenv from 'dotenv';

// Load .env file if present (local dev). In cloud platforms (Render/Railway), env vars come from process.env directly.
dotenv.config({ override: true });

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  } else {
    console.warn('⚠️  Warning: JWT_SECRET is not set in backend/.env');
  }
}

export default process.env;
