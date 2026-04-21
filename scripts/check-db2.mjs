import { readFileSync } from 'fs';
import pg from 'pg';

// Parse .env
const envContent = readFileSync(new URL('../.env', import.meta.url), 'utf-8');
for (const line of envContent.trim().split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length > 0) {
    process.env[key.trim()] = rest.join('=').trim();
  }
}

const url = process.env.DATABASE_URL;
console.log('URL:', url);
const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
if (match) {
  const [_, user, password, host, port, database] = match;
  console.log('User:', user, 'Host:', host, 'Port:', port, 'DB:', database);
  
  const pool = new pg.Pool({ host, port: parseInt(port), user, password, database });
  
  // List databases
  const dbs = await pool.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
  console.log('\nDatabases on server:', JSON.stringify(dbs.rows, null, 2));
  
  // Check table existence
  const tables = await pool.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  `);
  console.log('\nTables in database:', JSON.stringify(tables.rows, null, 2));
  
  // Check case study records
  const studyCount = await pool.query('SELECT count(*) FROM "CaseStudy";');
  console.log('\nTotal case studies:', studyCount.rows[0].count);
  
  const pubCount = await pool.query('SELECT count(*) FROM "CaseStudy" WHERE published = true;');
  console.log('Published case studies:', pubCount.rows[0].count);
  
  const allStudies = await pool.query('SELECT id, slug, title, published, "updatedAt" FROM "CaseStudy";');
  console.log('\nAll case studies:', JSON.stringify(allStudies.rows, null, 2));
  
  await pool.end();
}
