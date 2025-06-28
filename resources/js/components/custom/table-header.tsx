import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';

const TableHeader = ({ searchTerm, setSearchTerm, route }: { searchTerm: string; setSearchTerm: (term: string) => void; route: string }) => {
    return (
        <div className="flex items-center justify-between pb-4">
            <Input placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-1/3" />
            <Link href={route}>
                <Button className="cursor-pointer">Add Category</Button>
            </Link>
        </div>
    );
};

export default TableHeader;
