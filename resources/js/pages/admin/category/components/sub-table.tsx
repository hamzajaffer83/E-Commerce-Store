import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { Ellipsis } from 'lucide-react';

interface Props {
    filteredCategories: any[];
    handleCategoryDelete: (id: number) => void;
    parent_id: number;
}

const SubTable = ({ filteredCategories, handleCategoryDelete, parent_id }: Props) => {
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
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                            <tr key={category.id} className="border-b transition-all hover:bg-gray-500/10 dark:hover:bg-white/10">
                                <td className="px-4 py-2">{category.id}</td>
                                <td className="px-4 py-2">{category.name}</td>
                                <td className="px-4 py-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <div className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-500/20 dark:hover:bg-white/20">
                                                <Ellipsis className="h-5 w-5" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>
                                                <Link href={route('admin.category.sub.edit', { parent_id: parent_id, subCategoryId: category.id })}>
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <button onClick={() => handleCategoryDelete(category.id)}>Delete</button>
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

export default SubTable;
