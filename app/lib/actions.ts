'use server'
import {z} from 'zod'
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt'
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { FilteredUsers } from './definitions';

const ITEMS_PER_PAGE = 6;

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select  a customer',
    }),
    amount: z.coerce.number().gt(0,{message: 'Please enter  an amount  greather than $ 0 '}),
    status: z.enum(['pending','paid'],{invalid_type_error: 'Please select  an invoice status'}),
    date: z.string(),
});

//ADD  CREATE USER ZOD VALIDATION 
const UserFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

//CREATE FORMSCHEMA
const CreateUser = UserFormSchema.omit({id:true});


export async function createUser(formData: FormData){
  const {email,name,password} = CreateUser.parse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('username'),
  })
  
  const hashedPassword = await bcrypt.hash(password,10);

  try {
    await sql`
    INSERT INTO users (name,email,password)
    VALUES (${name},${email},${hashedPassword})
    `
  } catch (error) {
    console.log("SOMETHING BAD HAPPEN")
  }
  redirect('/login')
}

export async function fetchUsersPages(query:string){
try {
  const count = await sql`SELECT COUNT(*)
    FROM users
    WHERE
      name ILIKE ${`%${query}`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count)) / ITEMS_PER_PAGE;
    return totalPages;
  } catch (error) {
    console.error('DATABASE ERROR:',error);
    throw new Error('FAILED TO FETCH TOTAL PAGES OF USERS')
  }
}

export async function fetchFilteredUsers(query:string, currentPage:number){
const offset = (currentPage - 1 ) * ITEMS_PER_PAGE;

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
  return users.rows;
} catch (error) {
  console.error('DATABASE ERROR:', error);
  throw new Error('FAILED TO FETCH USERS');
}
}


const CreateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(prevState : State,formData: FormData){
    
        const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if(!validatedFields.success){
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to create Invoice',
      }
    }
    const {customerId,amount,status}= validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    
    try {
      
      await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    message : 'ERROR AL CREAR INVOICE'
    console.log(error);
  }
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State ,formData: FormData) {
    
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  if(!validatedFields.success){
    return {
      errors : validatedFields.error.flatten().fieldErrors,
      message : 'Missing Fields. Failed to Update Invoice'
    }
  }
    const { customerId, amount, status } = validatedFields.data
  
   try {    
     await sql`
       UPDATE invoices
       SET customer_id = ${customerId}, amount = ${amount}, status = ${status}
       WHERE id = ${id}
     `;
    } catch (error) {
      message : 'ERROR AL ACTUALIZAR INVOICE'
      console.log(error)
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  export async function deleteInvoice(id: string) {
    try {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
      revalidatePath('/dashboard/invoices');
    } catch (error) {
      message: 'ERROR AL ELIMINAR INVOICE'
      console.log(error)
    }
  }

  export async function authenticate(prevState: string | undefined, formData: FormData){
    try {
      await signIn ('credentials',formData);
    } catch (error) {  
     if (error instanceof AuthError) {
      console.log(error.type)
       switch(error.type){
         case 'CredentialsSignin':
           return 'Invalid credentials.';
          case 'CallbackRouteError':
            return 'CallbackRoutError!!!' 
         default:
           return 'Something went wrong.';
       }
     }
     throw error;
    }
  }