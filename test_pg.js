const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT count(*) FROM "Asset"');
  console.log("DB count:", res.rows[0].count);
  await client.end();
}
run();
