import CodeOneLogo from "../ui/codeone-logo";
import RegisterForm from "../ui/register-form";

export default function Page(){
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[500px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="grid  h-20 w-full  rounded-lg bg-gray-500 p-3 md:h-26 place-items-center">
                   
                        <CodeOneLogo/>
                    
                </div>
                <RegisterForm/>
            </div>
        </main> 
    )
}