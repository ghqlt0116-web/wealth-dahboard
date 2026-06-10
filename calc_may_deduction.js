const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    
    // Get all May 2026 transactions including DEDUCTION
    const res = await client.query(`
      SELECT category, amount, "installmentGroupId", type
      FROM "Transaction" 
      WHERE type IN ('EXPENSE', 'DEDUCTION')
      AND date >= '2026-05-01' AND date < '2026-06-01'
    `);
    
    let totalFixed = 0;
    let totalVar = 0;
    
    const FIXED_CATS = ["원리금(모기지)", "원리금(후순위)", "신용이자", "회사식비", "기타 공제"];
    const EXCLUDE_CATS = ["회사대출 공제"];

    res.rows.forEach(tx => {
      const amount = Number(tx.amount);
      if (EXCLUDE_CATS.includes(tx.category)) return;

      const isFixed = FIXED_CATS.includes(tx.category) || 
                      (tx.installmentGroupId && tx.installmentGroupId.startsWith('fixed_'));
                      
      if (isFixed) {
        totalFixed += amount;
      } else {
        totalVar += amount;
      }
    });

    console.log("Total Fixed:", totalFixed);
    console.log("Total Var:", totalVar);
    console.log("Total Expense:", totalFixed + totalVar);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
