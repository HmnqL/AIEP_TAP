import clsx from "clsx";
import { Button } from "../ui/button";
import CodeOneLogo from "../ui/codeone-logo";
import LoginForm from "../ui/login-form";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";

export default function Page(){
    return(
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36 place-content-center items-center">
                    <CodeOneLogo/>
                </div>
                <LoginForm/>
                <form action={ async ()=>{
                    'use server'
                    redirect('/register')
                }}>
                <button className="flex w-full  h-10 items-center rounded-lg bg-gray-500  border-gray-500 px-6 text-sm font-medium text-white transition-colors hover:bg-gray-400 hover:focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 active:bg-gray-600">
                    Sign Up
                    <PlusIcon className='h-5 w-5 ml-auto text'/>
                </button>
                </form>
            </div>
        </main>
    )
}