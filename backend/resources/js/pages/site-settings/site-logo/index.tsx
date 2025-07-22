import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Trash2, Pencil } from 'lucide-react';
import ConfirmDialogBox from '@/pages/admin/products/components/confirm-dialog-box';
import { toast } from 'react-toastify';

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandInput,
} from '@/components/ui/command';

import { Checkbox } from '@/components/ui/checkbox';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Site Logo', href: '/admin/web-site/setting/site-logo' },
];

type Category = {
    id: number;
    name: string;
    assigned_logo_id: number | null; // added assigned logo info
};

type SiteLogo = {
    id: number;
    name: string;
    logo: string;
    categories: Category[];
};

type Props = {
    logos: SiteLogo[];
    categories: Category[];
};

type FormData = {
    name: string;
    logo: File | null;
};

const SiteLogoPage = ({ logos, categories }: Props) => {
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedLogoId, setSelectedLogoId] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, reset, errors } = useForm<FormData>({
        name: '',
        logo: null,
    });

    // State for assigning categories modal
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);

    // Update filtered categories on search change
    useEffect(() => {
        const filtered = categories.filter((cat) =>
            cat.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [search, categories]);

    // Find current logo's assigned categories when modal opens
    useEffect(() => {
        if (selectedLogoId !== null) {
            const logo = logos.find((l) => l.id === selectedLogoId);
            if (logo) {
                setSelectedCategories(logo.categories.map((c) => c.id));
            }
        }
    }, [selectedLogoId, logos]);

    const submitUpload = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.logo) formData.append('logo', data.logo);

        post(route('site-logo.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setOpenUploadModal(false);
            },
        });
    };

    const toggleCategory = (id: number, disabled: boolean) => {
        if (disabled) return; // prevent toggling disabled categories
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleAssignSave = () => {
        if (selectedLogoId === null) return;
        setLoading(true);

        router.post(
            route('site-logo.assign-category', selectedLogoId),
            { category_ids: selectedCategories },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Categories updated.');
                    setOpenAssignModal(false);
                },
                onError: () => toast.error('Failed to assign categories.'),
                onFinish: () => setLoading(false),
            }
        );
    };

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleDelete = () => {
        if (!selectedLogoId) return;
        setLoading(true);
        router.delete(route('site-logo.destroy', selectedLogoId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Logo deleted successfully.');
                setShowConfirmModal(false);
            },
            onError: () => toast.error('Failed to delete logo.'),
            onFinish: () => {
                setSelectedLogoId(null);
                setLoading(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Site Logo" />

            <div className="p-2">
                <div className="border max-w-3xl w-full mx-auto p-6 rounded-md shadow mt-5">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Site Logos</h1>
                        <Dialog open={openUploadModal} onOpenChange={setOpenUploadModal}>
                            <DialogTrigger asChild>
                                <Button>Add Logo</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Upload Logo</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submitUpload} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="logo">Logo Image</Label>
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData('logo', e.target.files?.[0] ?? null)}
                                        />
                                        {errors.logo && (
                                            <p className="text-sm text-red-500">{errors.logo}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setOpenUploadModal(false)}
                                            type="button"
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            Upload
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Separator className="mb-6" />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Preview</TableHead>
                                <TableHead>Categories</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logos.map((logo) => (
                                <TableRow key={logo.id}>
                                    <TableCell>{logo.name}</TableCell>
                                    <TableCell>
                                        <img
                                            src={`/storage/${logo.logo}`}
                                            alt={logo.name}
                                            className="w-20 h-12 object-contain rounded border"
                                        />
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        {logo.categories.map((cat) => (
                                            <span
                                                key={cat.id}
                                                className="inline-block rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-xs"
                                            >
                                                {cat.name}
                                            </span>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedLogoId(logo.id);
                                                setOpenAssignModal(true);
                                                setSearch('');
                                            }}
                                            title="Assign / Edit Categories"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedLogoId(logo.id);
                                                setShowConfirmModal(true);
                                            }}
                                            title="Delete Logo"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Assign Categories Modal */}
            <Dialog open={openAssignModal} onOpenChange={setOpenAssignModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Assign Categories</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Command>
                            <CommandInput
                                placeholder="Search categories..."
                                value={search}
                                onValueChange={setSearch}
                            />
                            <CommandGroup>
                                {filteredCategories.length === 0 && (
                                    <CommandItem disabled>No categories found.</CommandItem>
                                )}
                                {filteredCategories.map((cat) => {
                                    // Disable if category assigned to another logo (not this one)
                                    const isDisabled =
                                        cat.assigned_logo_id !== null && cat.assigned_logo_id !== selectedLogoId;
                                    return (
                                        <CommandItem
                                            key={cat.id}
                                            onSelect={() => toggleCategory(cat.id, isDisabled)}
                                            className={`flex items-center gap-2 ${
                                                isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                        >
                                            <Checkbox checked={selectedCategories.includes(cat.id)} disabled={isDisabled} />
                                            <span>{cat.name}</span>
                                            {isDisabled && (
                                                <span
                                                    className="ml-auto text-xs italic text-red-500"
                                                    title="Assigned to another logo"
                                                >
                                                    Assigned
                                                </span>
                                            )}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </Command>
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setOpenAssignModal(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleAssignSave} disabled={loading}>
                            Save
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Modal */}
            <ConfirmDialogBox
                open={showConfirmModal}
                onOpenChange={setShowConfirmModal}
                title="Delete Logo"
                description="Are you sure you want to delete this logo? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                loading={loading}
            />
        </AppLayout>
    );
};

export default SiteLogoPage;
