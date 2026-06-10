const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    const res = await client.query(`
      SELECT category, amount, date, "installmentGroupId"
      FROM "Transaction" 
      WHERE to_char(date, 'YYYY-MM') = '2036-05'
    `);
    
    console.log(res.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
