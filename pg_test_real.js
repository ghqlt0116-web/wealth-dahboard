const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    // Count total rows
    const countRes = await client.query(`SELECT COUNT(*) FROM "Transaction"`);
    console.log(`Total rows in Transaction: ${countRes.rows[0].count}`);
    
    // Fetch recent 5 rows based on creation or date
    const dataRes = await client.query(`SELECT id, date, type, amount, category, memo FROM "Transaction" ORDER BY date DESC LIMIT 5`);
    console.log(`\nMost recent 5 entries (ORDER BY date DESC):`);
    console.log(dataRes.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
