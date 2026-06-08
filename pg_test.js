const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL successfully!");
    
    // 1. List all tables in public schema
    const tablesRes = await client.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `);
    console.log("Tables in public schema:", tablesRes.rows.map(r => r.tablename));
    
    // 2. Try to fetch some rows from Transaction
    for (const row of tablesRes.rows) {
      const name = row.tablename;
      if (name.toLowerCase().includes('transaction')) {
        const dataRes = await client.query(`SELECT * FROM "${name}" LIMIT 2`);
        console.log(`\nSample data from ${name}:`);
        console.log(dataRes.rows);
      }
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
