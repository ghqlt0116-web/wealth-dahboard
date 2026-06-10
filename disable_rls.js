const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    // Disable RLS
    await client.query(`ALTER TABLE "Transaction" DISABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE "UserSetting" DISABLE ROW LEVEL SECURITY;`);
    console.log("Successfully disabled RLS on Transaction and UserSetting!");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
