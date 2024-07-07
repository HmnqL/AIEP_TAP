import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { getUser } from '@/auth';

const UserFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });


  export async function POST(req: NextRequest) {

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    const formData = await req.formData();
    const parsedCredentials = UserFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    });

    if (!parsedCredentials.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 , headers: corsHeaders });
    }
    
    const { email, password } = parsedCredentials.data;
    const user = await getUser(email);
  
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 , headers: corsHeaders });
    }
  
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 , headers: corsHeaders });
    }
  
    return NextResponse.json({ message: 'Sign in successful MONOLITH', user }, { status: 200, headers: corsHeaders });
  }