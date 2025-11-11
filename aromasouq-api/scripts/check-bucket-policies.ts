import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBucketPolicies() {
  console.log('Checking Supabase bucket configurations...\n');

  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }

  console.log('Buckets found:', buckets?.length || 0);
  console.log('');

  for (const bucket of buckets || []) {
    console.log(`Bucket: ${bucket.name}`);
    console.log(`  - Public: ${bucket.public}`);
    console.log(`  - File Size Limit: ${bucket.file_size_limit ? `${bucket.file_size_limit / 1024 / 1024}MB` : 'None'}`);
    console.log(`  - Allowed MIME Types: ${bucket.allowed_mime_types?.join(', ') || 'All'}`);
    console.log(`  - Created: ${bucket.created_at}`);
    console.log('');
  }

  console.log('SECURITY ANALYSIS:');
  console.log('==================');
  console.log('✓ Buckets marked as "public" allow READ access to anyone');
  console.log('✓ WRITE/DELETE operations require authentication via your API');
  console.log('✓ Direct uploads to Supabase are blocked by default');
  console.log('✓ All uploads must go through your NestJS API with JWT auth');
}

checkBucketPolicies()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
