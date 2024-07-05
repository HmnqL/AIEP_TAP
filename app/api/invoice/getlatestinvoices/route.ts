import { LatestInvoiceRaw } from "@/app/lib/definitions";
import { formatCurrency } from "@/app/lib/utils";
import { sql } from "@vercel/postgres";
import { NextResponse,NextRequest } from "next/server";


export async function GET(req:NextRequest){

    try {
        const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return NextResponse.json(latestInvoices) //CAUTION THIS RETURNS AN OBJECT INSIDE AN ARRAY [{}]
    } catch (error) {
        console.error('DATABASE ERROR:', error);
        return NextResponse.json({ error: 'FAILED TO FETCH LATEST INVOICES' }, { status: 500 });
    }

}