const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    const countRes = await client.query(`
      SELECT category, card, amount, date
      FROM "Transaction" 
      WHERE category IN ('회사대출 공제', '원리금(모기지)', '원리금(후순위)')
      ORDER BY date DESC
      LIMIT 10
    `);
    console.log("Deductions:");
    console.log(countRes.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
