import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

const escapeString = (str) => {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? '1' : '0';
  if (str instanceof Date) return `'${str.toISOString().slice(0, 19).replace('T', ' ')}'`;
  if (typeof str === 'number') return str;
  // Escape single quotes and backslashes
  return "'" + String(str).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
};

async function exportTable(tableName, prismaModel) {
  let data = [];
  if (prismaModel) {
    data = await prisma[prismaModel].findMany();
  } else {
    try {
      data = await prisma.$queryRawUnsafe(`SELECT * FROM ${tableName}`);
    } catch (e) {
      console.log(`Table ${tableName} might not exist, skipping.`);
      return '';
    }
  }

  if (data.length === 0) return '';

  let sql = `-- Data for ${tableName}\n`;
  const columns = Object.keys(data[0]);
  
  const BATCH_SIZE = 50;
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    sql += `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES\n`;
    
    const values = batch.map(row => {
      const rowVals = columns.map(col => escapeString(row[col]));
      return `(${rowVals.join(', ')})`;
    });
    
    sql += values.join(',\n') + ';\n\n';
  }
  
  return sql;
}

async function main() {
  console.log('Starting data export from TiDB...');
  let fullSql = 'SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\n\n';
  
  // Tables to export
  const tables = [
    { name: 'blogpost', model: 'blogPost' },
    { name: 'ContactSubmission', model: 'contactSubmission' },
    { name: 'servicepage', model: 'servicePage' },
    { name: 'loginattempt', model: 'loginAttempt' },
    { name: 'sitesetting', model: 'siteSetting' },
    { name: 'subdomaincontent', model: 'subdomainContent' },
    { name: 'job', model: 'job' },
    { name: 'jobapplication', model: 'jobApplication' },
    { name: 'redirect', model: 'redirect' },
    { name: 'review', model: 'review' },
    { name: 'PartnershipSubmission', model: 'partnershipSubmission' }
  ];

  for (const table of tables) {
    console.log(`Exporting ${table.name}...`);
    const sql = await exportTable(table.name, table.model);
    fullSql += sql;
  }
  
  fullSql += '\nSET FOREIGN_KEY_CHECKS = 1;\n';
  
  fs.writeFileSync('latest_backup.sql', fullSql);
  console.log('Export complete! Saved to latest_backup.sql');
}

main().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
