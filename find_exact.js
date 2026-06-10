const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    const countRes = await client.query(`
      SELECT category, amount, date, "installmentGroupId"
      FROM "Transaction" 
      WHERE category = '원리금(모기지)' AND to_char(date, 'YYYY-MM') = '2026-05'
    `);
    console.log("Exact Date:", countRes.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
