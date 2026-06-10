const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    const countRes = await client.query(`
      SELECT category, card, "installmentGroupId", count(*) as count, sum(amount) as total 
      FROM "Transaction" 
      WHERE type = 'EXPENSE' 
      GROUP BY category, card, "installmentGroupId"
      ORDER BY total DESC
      LIMIT 10
    `);
    console.log("Top expense groupings:");
    console.log(countRes.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
