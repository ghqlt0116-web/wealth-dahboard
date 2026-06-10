const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    const countRes = await client.query(`
      SELECT count(*) FROM "Transaction"
    `);
    console.log("Total tx:", countRes.rows[0].count);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
