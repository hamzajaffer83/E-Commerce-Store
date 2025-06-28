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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Sub Category',
        href: '/admin/category/sub/create/',
    },
];

export default function CreateSubCategory({ parent_category }: { parent_category: Category }) {
    const { data, setData, post, processing, errors } = useForm<Required<CategoryForm>>({
        name: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.category.sub.store', { parent_id: parent_category.id }));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Sub Category" />
            <div className="flex min-h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md shadow-md">
                    <CardHeader>
                        <CardTitle>Create Sub Category for {parent_category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Sub Category Name</Label>
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
                            <Button type="submit" className="w-full cursor-pointer" disabled={processing}>
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
