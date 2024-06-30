'use server'
import {z} from 'zod'
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select  a customer',
    }),
    amount: z.coerce.number().gt(0,{message: 'Please enter  an amount  greather than $ 0 '}),
    status: z.enum(['pending','paid'],{invalid_type_error: 'Please select  an invoice status'}),
    date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};


const CreateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(prevState : State,formData: FormData){
    
        const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    console.log(Object.fromEntries(formData.entries()));
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
    const amountInCents = amount * 100;
   try {    
     await sql`
       UPDATE invoices
       SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
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

  import { signIn } from '@/auth';
  import { AuthError } from 'next-auth';
  

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