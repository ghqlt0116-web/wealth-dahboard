const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wkcvgjvicukgojlbwnzf:Csh326677!!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

const assets = [
  { name: 'SK하이닉스', group: '주식계좌', ticker: '000660.KS', quantity: 9, purchase_price: 947374, current_price: 2048000 },
  { name: 'TIGER 미국우주테크', group: '주식계좌', ticker: '465660.KS', quantity: 225, purchase_price: 10445, current_price: 17735 }, // Mapped 0183J0 to actual 465660 for Yahoo
  { name: 'RISE 현대차고정피지컬AI', group: '주식계좌', ticker: '479620.KS', quantity: 150, purchase_price: 13056, current_price: 12210 }, // Mapped 0190C0
  { name: 'TIGER 미국나스닥100', group: '주식계좌', ticker: '133690.KS', quantity: 3, purchase_price: 191379, current_price: 195425 },
  { name: 'ACE 미국S&P500', group: '주식계좌', ticker: '360200.KS', quantity: 5, purchase_price: 28147, current_price: 28160 },
  { name: 'RISE 미국양자컴퓨팅', group: 'ISA계좌', ticker: '484040.KS', quantity: 80, purchase_price: 22477, current_price: 22360 }, // Mapped 0018Z0
  { name: 'KoAct 미국로봇피지컬AI액티브', group: 'ISA계좌', ticker: '486770.KS', quantity: 120, purchase_price: 11519, current_price: 11360 }, // Mapped 0186L0
  { name: 'KODEX 은선물(H)', group: 'ISA계좌', ticker: '144600.KS', quantity: 1, purchase_price: 12359, current_price: 10660 },
  { name: 'KODEX 미국AI전력핵심인프라', group: 'ISA계좌', ticker: '487230.KS', quantity: 100, purchase_price: 25657, current_price: 24330 },
  { name: 'KODEX AI전력핵심설비', group: 'ISA계좌', ticker: '487240.KS', quantity: 100, purchase_price: 47341, current_price: 43625 },
  { name: '금', group: '금현물계좌', ticker: null, quantity: 1, purchase_price: 210000, current_price: 210000 },
  { name: '한국TDF알아서2050자H(주혼-재)CP', group: '연금저축', ticker: null, quantity: 1, purchase_price: 9750000, current_price: 14195683 },
  { name: '현금성대기자산', group: '퇴직연금', ticker: null, quantity: 1, purchase_price: 69028, current_price: 69100 },
  { name: 'ACE KRX 금현물', group: '퇴직연금', ticker: '411060.KS', quantity: 1, purchase_price: 1062548, current_price: 1114255 },
  { name: '미래에셋전략배분TDF2055혼합자산투자신탁종류C-P2E', group: '퇴직연금', ticker: null, quantity: 1, purchase_price: 3058306, current_price: 3883037 },
  { name: '한국투자TIF알아서평생소득증권자투자신탁[채권-재간접형]', group: '퇴직연금', ticker: null, quantity: 1, purchase_price: 1892107, current_price: 2337135 },
  { name: 'TME 미국나스닥100액티브', group: '퇴직연금', ticker: null, quantity: 1, purchase_price: 1378260, current_price: 2182445 },
  
  // Real Estate and Cash
  { name: '아파트', group: '부동산', ticker: null, quantity: 1, purchase_price: 800000000, current_price: 800000000 },
  { name: '현금(여유)', group: '신한은행', ticker: null, quantity: 1, purchase_price: 3199817, current_price: 3199817 },
  { name: '현금(CMA)', group: '미래에셋', ticker: null, quantity: 1, purchase_price: 4800000, current_price: 4800000 },
  { name: '현금(주식 예수금)', group: '미래에셋', ticker: null, quantity: 1, purchase_price: 3225118, current_price: 3225118 },
  { name: '현금(ISA 예수금)', group: '미래에셋', ticker: null, quantity: 1, purchase_price: 1713522, current_price: 1713522 }
];

const debts = [
  { name: '아파트 모기지', bank: '신한은행', balance: 269986420, interest_rate: 1.30, monthly_payment: 983450 },
  { name: '아파트 후순위', bank: '신한은행', balance: 62776469, interest_rate: 4.25, monthly_payment: 280241 },
  { name: '신용대출(마통)', bank: '우리은행', balance: 25994451, interest_rate: 5.46, monthly_payment: 155000 },
  { name: '회사대출 사우회', bank: 'SKB', balance: 10875000, interest_rate: 1.20, monthly_payment: 0 },
  { name: '회사대출 주택', bank: 'SKB', balance: 61603000, interest_rate: 1.20, monthly_payment: 0 }
];

async function run() {
  try {
    await client.connect();
    console.log("Connected to DB.");

    // Insert Assets
    for (const asset of assets) {
      await client.query(`
        INSERT INTO "Asset" (name, "group", ticker, quantity, purchase_price, current_price)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [asset.name, asset.group, asset.ticker, asset.quantity, asset.purchase_price, asset.current_price]);
    }
    console.log("Assets inserted!");

    // Insert Debts
    for (const debt of debts) {
      await client.query(`
        INSERT INTO "Debt" (name, bank, balance, interest_rate, monthly_payment)
        VALUES ($1, $2, $3, $4, $5)
      `, [debt.name, debt.bank, debt.balance, debt.interest_rate, debt.monthly_payment]);
    }
    console.log("Debts inserted!");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
