import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Metadata } from "next"
import Table from '@/app/ui/users/table'
import { fetchUsersPages } from "@/app/lib/actions";
import Pagination from "@/app/ui/invoices/pagination";
export const metadata: Metadata = {
    title: 'Usuarios'
};

export default async function Page({searchParams}:{searchParams?:{query?: string;page?: string;}}){

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page || 1);
    const totalPages = await fetchUsersPages(query);

    return (
    <main className="w-full">
        <div className="flex w-full items-center justify-between">
            <h1 className={`${lusitana.className} text-2x1`}>Usuarios</h1>
        </div>
        <div className="mt-4 flex items-center justify-between">
            <Search placeholder="Search users..." />
        </div>
        <div>
            {<Table query={query} currentPage={currentPage}/>}
        </div>
        <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages}/>
        </div>
    </main>
)
}