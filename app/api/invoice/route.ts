import { sql } from "@vercel/postgres";
import { NextRequest,NextResponse } from "next/server";
import {z} from 'zod'

const InvoiceFormSchema = z.object({
    customerId: z.string({
      invalid_type_error: 'Please select  a customer',
    }),
    amount: z.coerce.number().gt(0,{message: 'Please enter  an amount  greather than $ 0 '}),
    status: z.enum(['pending','paid'],{invalid_type_error: 'Please select  an invoice status'}),
});

export async function POST(req:NextRequest){
    const formData = await req.formData();
    console.log(formData);
    const {customerId, amount,status} = InvoiceFormSchema.parse({
        customerId : formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amount}, ${status}, ${date})
    `;
    return NextResponse.json({
        message: 'INVOICE CREATED SUCCEFULLY ',
        customerId: customerId,
        amount: amount,
        status: status,
        date: date
    });
    } catch (error) {
        console.error('DATABASE ERROR:', error);
        return NextResponse.json({ error: 'FAILED TO CREATE INVOICE' }, { status: 500 });
    }
}