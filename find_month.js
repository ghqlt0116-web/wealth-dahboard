const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    // Check all months
    const res = await client.query(`
      SELECT 
        to_char(date, 'YYYY-MM') as month,
        sum(case when type = 'INCOME' then amount else 0 end) as total_income,
        sum(case when type = 'EXPENSE' then amount else 0 end) as total_expense
      FROM "Transaction" 
      GROUP BY to_char(date, 'YYYY-MM')
      ORDER BY month DESC
    `);
    
    console.log(res.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
