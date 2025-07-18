import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';

const TableHeader = (
    { searchTerm, setSearchTerm, route, btnText }: { searchTerm: string; setSearchTerm: (term: string) => void; route: string, btnText: string }
) => {
    return (
        <div className="flex items-center w-full justify-between pb-4">
            <Input placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-1/3" />
            <Link href={route}>
                <Button className="cursor-pointer">{btnText}</Button>
            </Link>
        </div>
    );
};

export default TableHeader;
