// === Imports ===
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import AppLayout from '@/layouts/app-layout';
import ConfirmDialogBox from '@/pages/admin/products/components/confirm-dialog-box';
import { BreadcrumbItem } from '@/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// === Breadcrumbs ===
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Category Theme',
        href: '/admin/web-site/setting/category-theme',
    },
];

// === Component ===
export default function CategoryThemeSettings({ themes, categories }: { themes: any[]; categories: any[] }) {
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { data, setData, post, put, processing, reset } = useForm({
        category_id: '',
        theme_color: '',
    });

    const openEdit = (theme: any) => {
        setData({
            category_id: theme.category_id,
            theme_color: theme.theme_color,
        });
        setIsEditing(true);
        setEditId(theme.id);
        setFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const onSuccess = () => {
            reset();
            setFormOpen(false);
            setIsEditing(false);
        };

        isEditing && editId !== null
            ? put(route('admin.category-theme.update', editId), { onSuccess })
            : post(route('admin.category-theme.store'), { onSuccess });
    };

    const handleDelete = () => {
        if (!selectedId) return;
        router.delete(route('admin.category-theme.destroy', selectedId), {
            onSuccess: () => setConfirmOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category Themes" />

            <div className="mx-auto mt-5 w-full max-w-2xl space-y-4 rounded-md border p-4 shadow">
                <div className='flex justify-between'>
                    <h1 className="text-2xl font-semibold">Category Theme Settings</h1>
                    <Button onClick={() => setFormOpen(true)}>Add Theme</Button>
                </div>

                {/* Dialog Form */}
                <Dialog open={formOpen} onOpenChange={setFormOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Theme' : 'Add Theme'}</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Category Select */}
                            <div>
                                <Label>Category</Label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded border p-2"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Color Picker */}
                            <div>
                                <Label>Theme Color</Label>
                                <div className="flex flex-col items-start gap-2">
                                    <HexColorPicker color={data.theme_color} onChange={(color) => setData('theme_color', color)} />
                                    <Input value={data.theme_color} onChange={(e) => setData('theme_color', e.target.value)} className="w-full" />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2">
                                <Button type="button" onClick={() => setFormOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {isEditing ? 'Update' : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Theme Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Theme Color</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {themes.map((theme: any) => (
                            <TableRow key={theme.id}>
                                <TableCell>{theme.category?.name}</TableCell>
                                <TableCell>
                                    <Badge className="rounded-md" style={{ backgroundColor: theme.theme_color }}>
                                        <p className="text-white">{theme.theme_color}</p>
                                    </Badge>
                                </TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Button size="icon" variant="outline" onClick={() => openEdit(theme)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => {
                                            setSelectedId(theme.id);
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

                {/* Delete Confirmation */}
                <ConfirmDialogBox
                    open={confirmOpen}
                    onOpenChange={setConfirmOpen}
                    title="Delete Theme"
                    description="Are you sure you want to delete this theme?"
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDelete}
                />
            </div>
        </AppLayout>
    );
}
