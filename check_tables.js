const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(res.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
