import { Button } from '@/components/ui/button';
import { PaginationLink } from '@/types/paginations';
import { router } from '@inertiajs/react';
import { MoveLeft, MoveRight } from 'lucide-react';

export interface Pagination {
    current_page: number;
    links: PaginationLink[];
    last_page: number;
}

const Pagination = ({ pagination }: { pagination: Pagination }) => {
    return (
        <div className="flex items-center gap-4">
            <Button
                className="cursor-pointer"
                disabled={!pagination.links[0].url}
                onClick={() => router.get(pagination.links[0].url!, {}, { preserveScroll: true })}
            >
                <MoveLeft /> Previous
            </Button>
            <div className="text-sm text-gray-600">
                Page <strong>{pagination.current_page}</strong> of <strong>{pagination.last_page}</strong>
            </div>
            <Button
                className="cursor-pointer"
                disabled={!pagination.links[pagination.links.length - 1].url}
                onClick={() => router.get(pagination.links[pagination.links.length - 1].url!, {}, { preserveScroll: true })}
            >
                Next <MoveRight />
            </Button>
        </div>
    );
};

export default Pagination;
