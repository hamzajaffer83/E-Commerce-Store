import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const PerPageDropdown = ({ per_page, route }: { per_page: number; route: string }) => {
    const [perPage, setPerPage] = useState(per_page);
    return (
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Show:</span>
            <DropdownMenu>
                <DropdownMenuTrigger className="rounded border px-4 py-2 text-sm shadow-sm">{perPage}</DropdownMenuTrigger>
                <DropdownMenuContent>
                    {[5, 10, 25, 50, 100].map((num) => (
                        <DropdownMenuItem
                            key={num}
                            onSelect={() => {
                                setPerPage(num);
                                router.get(route, { per_page: num }, { preserveScroll: true });
                            }}
                            className="cursor-pointer"
                        >
                            {num}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default PerPageDropdown;
