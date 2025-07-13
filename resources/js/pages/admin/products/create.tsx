import CustomTextEditor from '@/components/custom/custom-text-editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Category } from '@/types/data';
import { ProductForm } from '@/types/form';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import CategoryDropdown from './components/category-dropdowns';
import SimpleProduct from './components/simple-product';
import VariableProduct from './components/variable-product';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Create Product', href: '/admin/product/create' }];

export default function ProductCreate({ categories, sub_categories }: { categories: Category[]; sub_categories: Category[] }) {
    const [productType, setProductType] = useState<'simple' | 'variable'>('variable');

    const { data, setData, post, processing, errors } = useForm<Required<ProductForm>>({
        title: '',
        cover_image: null as File | null,
        description: '',
        category_id: null as number | null,
        sub_category_id: null as number | null,
        type: 'variable',

        sizes: [] as string[],
        color: '',
        price: '',
        sale_price: '',
        sale_start_at: '',
        sale_end_at: '',
        quantity: null as number | null,

        variants: [] as {
            image: File | null;
            size: string;
            color: string;
            price: string;
            sale_price?: string;
            quantity: number;
            sku?: string;
        }[],
    });

    // Keep form data in sync with selected productType
    useEffect(() => {
        setData('type', productType);
    }, [productType]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.product.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <div className="m-4 rounded-md border p-4">
                <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
                    {/* Title & Cover Image */}
                    <div className="w-full gap-4 sm:flex">
                        <div className="mb-3 grid gap-2 sm:mb-0 sm:w-1/2">
                            <Label htmlFor="title">Product Title*</Label>
                            <Input
                                id="title"
                                type="text"
                                required
                                autoFocus
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Product Title"
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2 sm:w-1/2">
                            <Label htmlFor="cover_image">Product Cover Image*</Label>
                            <Input id="cover_image" type="file" onChange={(e) => setData('cover_image', e.target.files?.[0] ?? null)} />
                            <InputError message={errors.cover_image} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="grid gap-2">
                        <Label htmlFor="description">Product Description*</Label>
                        <CustomTextEditor onChange={(html) => setData('description', html)} />
                        <InputError message={errors.description} />
                    </div>

                    {/* Category Dropdown */}
                    <CategoryDropdown
                        parent_category={categories}
                        parentValue={data.category_id}
                        setParentValue={(value) => setData('category_id', value)}
                        sub_category={sub_categories}
                        subCategoryValue={data.sub_category_id}
                        setSubCategoryValue={(value) => setData('sub_category_id', value)}
                    />

                    {/* Product Type Dropdown */}
                    <div className="flex items-center justify-between border-t border-dashed pt-4">
                        <h1 className="text-lg">Other Details</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Product Type: {productType.charAt(0).toUpperCase() + productType.slice(1)}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setProductType('simple');
                                        setData('variants', []);
                                    }}
                                >
                                    Simple
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setProductType('variable');
                                        setData('sizes', []);
                                        setData('color', '');
                                        setData('price', '');
                                        setData('sale_price', '');
                                        setData('sale_end_at', '');
                                        setData('sale_start_at', '');
                                        setData('quantity', null);
                                    }}
                                >
                                    Variable
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {productType === 'simple' ? (
                        <SimpleProduct
                            data={{
                                sizes: data.sizes,
                                color: data.color,
                                price: data.price,
                                sale_price: data.sale_price,
                                sale_start_at: data.sale_start_at,
                                sale_end_at: data.sale_end_at,
                                quantity: data.quantity,
                            }}
                            setData={(field, value) => setData(field as keyof typeof data, value)}
                            errors={{
                                sizes: errors.sizes,
                                color: errors.color,
                                price: errors.price,
                                sale_price: errors.sale_price,
                                sale_start_at: errors.sale_start_at,
                                sale_end_at: errors.sale_end_at,
                                quantity: errors.quantity,
                            }}
                        />
                    ) : (
                        <VariableProduct
                            data={{
                                variants: data.variants,
                                price: data.price,
                                sale_price: data.sale_price,
                                sale_start_at: data.sale_start_at,
                                sale_end_at: data.sale_end_at,
                            }}
                            setData={(field, value) => setData(field as keyof typeof data, value)}
                            errors={{
                                variants: Array.isArray(errors.variants) ? errors.variants : [],
                                sale_start_at: errors.sale_start_at,
                                sale_end_at: errors.sale_end_at,
                                price: errors.price,
                                sale_price: errors.sale_price,
                            }}
                        />
                    )}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={processing}>
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
            </div>
        </AppLayout>
    );
}
