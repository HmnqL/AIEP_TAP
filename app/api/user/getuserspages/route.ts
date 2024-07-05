import { sql } from "@vercel/postgres";
import { NextResponse,NextRequest } from "next/server";

const ITEMS_PER_PAGE = 6;

export async function GET(req: NextRequest){
    const {searchParams} = new URL(req.url);
    const query = searchParams.get('query') || '';

    try {
        const count = await sql`SELECT COUNT(*)
        FROM users
        WHERE
            name ILIKE ${`%${query}`}
    `;
    const totalPages = Math.ceil(Number(count.rows[0].count)) / ITEMS_PER_PAGE;
    return NextResponse.json(totalPages)
    } catch (error) {
        console.error('DATABASE ERROR:', error);
        return NextResponse.json({ error: 'FAILED TO FETCH USERS PAGES' }, { status: 500 });
    }

}