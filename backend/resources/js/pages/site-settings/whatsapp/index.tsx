import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import ConfirmDialogBox from '@/pages/admin/products/components/confirm-dialog-box';
import { Textarea } from '@/components/ui/textarea';

type WhatsAppNumber = {
    id: number;
    name: string;
    phone: string;
    message: string;
    is_active: boolean;
};

type Props = {
    numbers: WhatsAppNumber[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Whatsapp',
        href: '/admin/web-site/setting/whatsapp',
    },
];

const WhatsAppAdminSettings = ({ numbers }: Props) => {
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const { data, setData, post, put, reset, processing } = useForm({
        name: '',
        phone: '',
        message: '',
    });

    const openAddModal = () => {
        reset();
        setIsEditing(false);
        setEditId(null);
        setFormOpen(true);
    };

    const openEditModal = (num: WhatsAppNumber) => {
        setData({
            name: num.name,
            phone: num.phone,
            message: num.message,
        });
        setEditId(num.id);
        setIsEditing(true);
        setFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        console.log('Btn CLicked');
        e.preventDefault();
        if (isEditing && editId !== null) {
            put(route('admin.whatsapp.update', editId), {
                onSuccess: () => {
                    reset();
                    setFormOpen(false);
                    setIsEditing(false);
                    setEditId(null);
                },
            });
        } else {
            post(route('admin.whatsapp.store'), {
                onSuccess: () => {
                    reset();
                    setFormOpen(false);
                },
            });
        }
    };

    const handleSetActive = (id: number) => {
        router.post(route('admin.whatsapp.set-active', id));
    };

    const handleDelete = () => {
        if (!selectedId) return;
        setDeleting(true);
        router.delete(route('admin.whatsapp.destroy', selectedId), {
            onSuccess: () => setConfirmOpen(false),
            onFinish: () => {
                setSelectedId(null);
                setDeleting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Whatsapp" />

            <div className="space-y-6 max-w-2xl w-full border rounded-md shadow mx-auto mt-10 p-4">
                <h1 className="text-2xl font-semibold">WhatsApp Numbers</h1>

                <Button onClick={openAddModal}>Add Number</Button>

                {/* Dialog for Add/Edit */}
                <Dialog open={formOpen} onOpenChange={setFormOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {isEditing ? 'Edit WhatsApp Number' : 'Add WhatsApp Number'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Message</Label>
                                <Textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                        setFormOpen(false);
                                        reset();
                                        setIsEditing(false);
                                        setEditId(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {isEditing ? 'Update' : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {numbers.map((num) => (
                            <TableRow key={num.id}>
                                <TableCell>{num.name}</TableCell>
                                <TableCell>{num.phone}</TableCell>
                                <TableCell className="whitespace-pre-wrap">{num.message}</TableCell>
                                <TableCell>
                                    {num.is_active ? (
                                        <Badge variant="default">Active</Badge>
                                    ) : (
                                        <Badge variant="secondary">Inactive</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => openEditModal(num)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    {!num.is_active && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSetActive(num.id)}
                                            >
                                                Set Active
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedId(num.id);
                                                    setConfirmOpen(true);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

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
            </div>
        </AppLayout>
    );
};

export default WhatsAppAdminSettings;
