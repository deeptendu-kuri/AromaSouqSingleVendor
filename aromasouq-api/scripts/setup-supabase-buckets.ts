import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const BUCKETS = [
  {
    name: 'products',
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'],
  },
  {
    name: 'users',
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  {
    name: 'brands',
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  {
    name: 'documents',
    public: false,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['application/pdf'],
  },
];

async function setupBuckets() {
  console.log('Setting up Supabase storage buckets...\n');

  for (const bucket of BUCKETS) {
    try {
      // Check if bucket exists
      const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();

      if (listError) {
        console.error(`Error listing buckets: ${listError.message}`);
        continue;
      }

      const bucketExists = existingBuckets?.some(b => b.name === bucket.name);

      if (bucketExists) {
        console.log(`✓ Bucket '${bucket.name}' already exists`);
        continue;
      }

      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes,
      });

      if (error) {
        console.error(`✗ Failed to create bucket '${bucket.name}': ${error.message}`);
      } else {
        console.log(`✓ Created bucket '${bucket.name}' (${bucket.public ? 'public' : 'private'})`);
      }
    } catch (error) {
      console.error(`✗ Error setting up bucket '${bucket.name}':`, error);
    }
  }

  console.log('\nBucket setup complete!');
}

setupBuckets()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
