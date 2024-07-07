import { sql } from "@vercel/postgres";
import { NextResponse,NextRequest } from "next/server";


export async function GET(req: NextRequest){
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

    try {
        const data = await sql`
        SELECT
         (SELECT COUNT(*) FROM customers)AS "totalcustomers",
         COUNT(*) AS "totalinvoices",
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
        FROM invoices
        `;

        return NextResponse.json(data.rows[0],{status:200,headers:corsHeaders})
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
      }
}