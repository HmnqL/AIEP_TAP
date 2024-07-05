import { signOut } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

  await signOut();
  
  return NextResponse.json({ message: 'Sign out successful' });
}