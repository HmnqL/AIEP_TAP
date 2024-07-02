import { fetchFilteredUsers } from "@/app/lib/actions";
import { AtSymbolIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default async function UsersTable({query, currentPage}:{query: string; currentPage: number}){

    

    const users = await fetchFilteredUsers(query,currentPage);

    return(
    <div className="mt-flow-root">
        <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                <div className="md:hidden">
                    {users?.map((user)=>(
                        <div key={user.name} className="mb-2 w-full rounded-md bg-white p-4">
                            <div className="flex flex-col items-center justify-between border-b pb-2">
                                <div>
                                    <div className="mb-2 flex flex-col items-center">
                                        <div className=" flex items-center gap-3 pb-2 ">
                                        <UserCircleIcon className="h-5 w-5"/>
                                        </div>
                                        <div className="pb-2">
                                            <p>{user.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                   <div className="mb-2 flex flex-col items-center">
                                        <div className="flex  items-center gap-3 pb-2">
                                        <AtSymbolIcon className="h-5 w-5"/>
                                        </div>
                                        <div className="pb-2">
                                        <p>{user.email}</p>
                                        </div>
                                   </div>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
                <table className="hidden min-w-full text-gray-900 md:table">
                    <thead className="rounded-lg text-left text-sm font-normal">
                        <tr>
                            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                Nombre
                            </th>
                            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                Email
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-500">
                        {users.map((user)=>(
                            <tr key={user.name} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="h-5 w-5 text-yellow-600"/>
                                        <p className="text-white">{user.name}</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <AtSymbolIcon className="h-5 w-5 text-yellow-600"/>
                                        <p className="text-white">{user.email}</p>
                                    </div>
                                </td>    
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
)
}