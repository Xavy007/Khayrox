const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const envContent = fs.readFileSync('e:/KHAYROX/WebKhayrox/catalogo-app/.env.local', 'utf8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/);
  const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/);
  if (urlMatch) supabaseUrl = urlMatch[1].trim().replace(/['"]/g, '');
  if (keyMatch) supabaseAnonKey = keyMatch[1].trim().replace(/['"]/g, '');
} catch (e) {
  console.error("Failed to read .env.local:", e.message);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("Supabase URL or Anon Key is missing.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Updating hero_banner_url in site_config to /hero-showcase-branded-final.png...");
  const { data, error } = await supabase
    .from('site_config')
    .upsert({ key: 'hero_banner_url', value: '/hero-showcase-branded-final.png' });
    
  if (error) {
    console.error("Error updating configuration in Supabase:", error.message);
  } else {
    console.log("Database updated successfully!");
  }
}

run();
