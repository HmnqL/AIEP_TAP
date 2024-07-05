import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { FilteredUsers } from '@/app/lib/definitions';

const ITEMS_PER_PAGE = 6;

//GET USER BY NAME
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const currentPage = parseInt(searchParams.get('currentPage') || '1', 10);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const users = await sql<FilteredUsers>`
      SELECT
        name,
        email
      FROM users
      WHERE
        name ILIKE ${`%${query}%`}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return NextResponse.json(users.rows);
  } catch (error) {
    console.error('DATABASE ERROR:', error);
    return NextResponse.json({ error: 'FAILED TO FETCH USERS' }, { status: 500 });
  }
}
