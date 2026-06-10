const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    const countRes = await client.query(`
      SELECT card, "installmentGroupId", category, count(*) as count, sum(amount) as total 
      FROM "Transaction" 
      WHERE type = 'EXPENSE' 
      AND date >= '2026-05-01' AND date < '2026-06-01'
      GROUP BY card, "installmentGroupId", category
    `);
    console.log("May 2026 transactions:");
    console.log(countRes.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
