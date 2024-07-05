import { NextResponse,NextRequest } from "next/server";
import { sql } from "@vercel/postgres";
import { InvoiceForm } from "@/app/lib/definitions";


export async function GET(req: NextRequest,{params}:{params:{id:string}}){
    const id = params.id
    try {
        const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
        ...invoice,
        amount: invoice.amount,
    }));
    return NextResponse.json(invoice[0])
    } catch (error) {
        console.error('DATABASE ERROR:', error);
        return NextResponse.json({ error: 'FAILED TO FETCH INVOCE BY ID' }, { status: 500 }); 
    }
}