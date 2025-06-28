import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Category } from '@/types/data';
import { CategoryForm } from '@/types/form';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function EditCategory({ category }: { category: Category }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit Category',
            href: `/admin/category/${category.id}/edit`,
        },
    ];
    const { data, setData, put, processing, errors } = useForm<Required<CategoryForm>>({
        name: category.name || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('admin.category.update', category.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Category" />
            <div className="flex min-h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md shadow-md">
                    <CardHeader>
                        <CardTitle>Edit Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Category name"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <Button type="submit" className="w-full cursor-pointer" disabled={processing || data.name === category.name}>
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
