'use server'
import { NextRequest,NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import {z} from 'zod'
import bcrypt from 'bcrypt'

const UserFormSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
})

//CREATE USER

export async function POST(req: NextRequest){
    try {
            const formData = await req.formData();
            const { name, email, password } = UserFormSchema.parse({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
            });
            
            const hashedPassword = await bcrypt.hash(password, 10);

        await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword})
        `;

        return NextResponse.json({message: 'USER CREATED SUCCEFULLY '});
    } catch (error) {
        console.error('DATABASE ERROR: ',error);
        return NextResponse.json({error: 'FAILED TO CREATE USER '},{status: 500 })
    }
}