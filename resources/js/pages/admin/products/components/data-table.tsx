import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { Ellipsis } from 'lucide-react';

const DataTable = ({ filterProducts, handleProductDelete }: { filterProducts: any[]; handleProductDelete: (id: number) => void }) => {
    return (
        <div className="overflow-x-auto rounded border shadow">
            <table className="min-w-full table-auto text-left">
                <thead className="text-sm font-semibold text-gray-700 transition-all hover:bg-white/10 dark:text-white">
                <tr className="border-b">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Action</th>
                </tr>
                </thead>
                <tbody>
                {filterProducts.length > 0 ? (
                    filterProducts.map((product) => (
                        <tr key={product.id} className="border-b transition-all hover:bg-gray-500/10 dark:hover:bg-white/10">
                            <td className="px-4 py-2">{product.id}</td>
                            <td className="px-4 py-2">
                                <img src={`/storage/${product.cover_image}`} alt={product.title} className="w-auto h-12" />
                            </td>
                            <td className="px-4 py-2">
                                {product.title}
                            </td>
                            <td className="px-4 py-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <div className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-500/20 dark:hover:bg-white/20">
                                            <Ellipsis className="h-5 w-5" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {/*<DropdownMenuItem>*/}
                                        {/*    <Link href={route('admin.product.edit', product.id)}>Edit</Link>*/}
                                        {/*</DropdownMenuItem>*/}
                                        <DropdownMenuItem>
                                            <button onClick={() => handleProductDelete(product.id)}>Delete</button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                            No categories found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
