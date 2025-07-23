import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ConfirmDialogBox from '@/pages/admin/products/components/confirm-dialog-box';
import { Edit, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Site Link',
        href: '/admin/web-site/setting/site-link',
    },
];

type SiteLink = {
    id: number;
    name: string;
    link: string;
};

type Props = {
    links: SiteLink[];
};

const SiteLinkPage = ({ links }: Props) => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        link: '',
    });

    const openCreateModal = () => {
        setIsEditing(false);
        setEditingLinkId(null);
        reset();
        setOpen(true);
    };

    const openEditModal = (link: SiteLink) => {
        setIsEditing(true);
        setEditingLinkId(link.id);
        setData({
            name: link.name,
            link: link.link,
        });
        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && editingLinkId !== null) {
            put(route('site-link.update', editingLinkId), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    setEditingLinkId(null);
                    setIsEditing(false);
                },
            });
        } else {
            post(route('site-link.store'), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!selectedId) return;
        setDeleting(true);
        router.delete(route('site-link.destroy', selectedId), {
            onSuccess: () => setConfirmOpen(false),
            onFinish: () => {
                setSelectedId(null);
                setDeleting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Site Links" />

            <div className="mx-auto mt-5 w-full max-w-4xl rounded-md border p-6 shadow">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Social Links</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>Add Link</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{isEditing ? 'Edit Link' : 'Add New Link'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="link">Link</Label>
                                    <Input id="link" type="url" value={data.link} onChange={(e) => setData('link', e.target.value)} />
                                    {errors.link && <p className="text-sm text-red-500">{errors.link}</p>}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {isEditing ? 'Update' : 'Submit'}
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
                            <TableHead className="w-1/4">Name</TableHead>
                            <TableHead className="w-2/4">Link</TableHead>
                            <TableHead className="w-1/4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {links.map((link) => (
                            <TableRow key={link.id}>
                                <TableCell>{link.name}</TableCell>
                                <TableCell>
                                    <a href={link.link} target="_blank" rel="noopener noreferrer" className="break-all text-blue-600 underline">
                                        {link.link}
                                    </a>
                                </TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Button size="icon" variant="outline" onClick={() => openEditModal(link)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => {
                                            setSelectedId(link.id);
                                            setConfirmOpen(true);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <ConfirmDialogBox
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete WhatsApp Number"
                description="Are you sure you want to delete this WhatsApp number? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                loading={deleting}
            />
        </AppLayout>
    );
};

export default SiteLinkPage;
