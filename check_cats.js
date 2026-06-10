const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    const countRes = await client.query(`
      SELECT category, memo, card, amount, "installmentGroupId"
      FROM "Transaction" 
      WHERE category IN ('회사대출공제', '모기지', '후순위', '신용이자')
      OR memo LIKE '%모기지%' OR memo LIKE '%후순위%' OR memo LIKE '%회사%'
      LIMIT 10
    `);
    console.log("Special categories:");
    console.log(countRes.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
