'use client'

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { UserState, authenticate, createUser } from '@/app/lib/actions';
import { error } from 'console';


export default function RegisterForm(){
  //ADD NECCESARY CONST FOR FORMACTION
  return (
    <form className='space-y-5' action={createUser}>
      <div className='relative flex flex-col max-w-[400px] mx-auto'>
        <input className='peer h-10 bg-gray-200 rounded-md  pl-10 text-sm  outline-2 placeholder:text-gray'
        id='username'
        name='username'
        placeholder='User name'
        required/>
        <UserCircleIcon className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 peer-focus:text-yellow-600 h-[18px] w-[18px]'/>
      </div>
      <div className='relative mx-auto flex max-w-[400px] flex-col'>
        <input className='peer h-10 bg-gray-200 rounded-md  pl-10 text-sm  outline-2 placeholder:text-gray'
        id="email"
        type="email"
        name="email"
        placeholder='EMAIL'
        required
        />
        <AtSymbolIcon className='pointer-events-none absolute top-1/2  left-3 -translate-y-1/2 peer-focus:text-yellow-600 h-[18px] w-[18px]'/>
      </div>
      <div className='relative  flex flex-col max-w-[400px] mx-auto'>
        <input className='peer h-10 bg-gray-200 rounded-md  pl-10 text-sm  outline-2 placeholder:text-gray'
        type='password'
        name='password'
        placeholder='Password'
        required
        />
        <KeyIcon className='pointer-events-none absolute top-1/2  left-3 -translate-y-1/2 peer-focus:text-yellow-600 h-[18px] w-[18px]'/>
      </div>
      <div>
        <Button className='mt-4 w-full bg-gray-200'
        >
          SignUp <PlusIcon className='h-5 w-5 ml-auto text'/>
        </Button>
        <div className='flex h-8 items-end space-x-1'>
          <>
          <ExclamationCircleIcon className=' md:hidden h-5 w-5 text-red-500'/>
          </>
        </div>
      </div>
    </form>
  );
}