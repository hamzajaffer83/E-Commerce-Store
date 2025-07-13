import AppLayout from "@/layouts/app-layout";
import { convertUtcToLocal, convertUtcToLocalDate } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Category } from "@/types/data";
import { Head, router, usePage } from "@inertiajs/react";
import { Pen, PenBox, PenIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import EditProductModal from "./components/edit-product-modal";
import EditVariationModal from "./components/edit-variation-modal";
import EditImageModal from "./components/edit-image-modal";
import { toast } from "react-toastify";
import ConfirmDialogBox from "./components/confirm-dialog-box";

export type Variant = {
    id: number;
    product_id: number;
    sizes: string;
    color: string;
    image_path: string;
    price: string;
    sale_price: string;
    sale_start_at: string;
    sale_end_at: string;
    quantity: number;
    sku?: string;
    created_at: string;
    updated_at: string;
};

export type Product = {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image: string;
    type: 'simple' | 'variable';
    category_id: number;
    sub_category_id: number;
    created_at: string;
    updated_at: string;
    variations: Variant[];
}

type Props = {
    categories: Category[],
    sub_categories: Category[],
    product: Product
};

export default function EditProduct({ categories, sub_categories, product }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Edit Product', href: `/admin/product/edit/${product.id}` }];
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { autoClose: 3000 });
        if (flash?.error) toast.error(flash.error, { autoClose: 3000 });
    }, [flash]);

    const [showEditProductModal, setShowProductModal] = useState<boolean>(false);
    const [showEditVariationModal, setShowVariationModal] = useState<boolean>(false);
    const [showEditImageModal, setShowEditImageModal] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const [loading, setLoading] = useState(false);

    // Modal Data State
    const [selectedDeleteVariantId, setselectedDeleteVariantId] = useState<number>();
    const [seletedVariantData, setSelectedVariantData] = useState<Variant>();
    const [modalImageData, setModalImageData] = useState<{
        id: number | null;
        type: 'cover' | 'variant';
    }>({
        id: null,
        type: 'cover',
    });

    const handleDelete = () => {
        setLoading(true);
        // Simulate delete
        router.delete(route('admin.product.variant.destroy', selectedDeleteVariantId), {
            preserveScroll: true,
            onSuccess: () => toast.success('Product deleted successfully.'),
            onError: () => toast.error('Failed to delete product.'),
        });
        setShowConfirmModal(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />
            <div className="max-w-5xl min-w-full flex flex-col gap-y-3 md:p-10 m-5 mx-auto">
                <div className="rounded-lg border">
                    <div className="flex justify-between p-2 border-b">
                        <p className=""> <b>Slug</b> : {product.slug}</p>
                        <PenBox className="h-5 cursor-pointer" onClick={() => setShowProductModal(!showEditProductModal)} />
                    </div>
                    <div className="lg:flex">
                        <div className="relative flex w-full md:w-1/4 group">
                            <img
                                src={`/storage/${product.cover_image}`}
                                alt={product.title}
                                className="rounded-lg w-full"
                            />
                            <div
                                className="absolute cursor-pointer top-2 right-2 z-20 p-1 bg-gray-900/15 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <PenIcon onClick={() => {
                                    setShowEditImageModal(!showEditImageModal)
                                    setModalImageData({
                                        id: product.id,
                                        type: 'cover',
                                    });
                                }} />
                            </div>
                        </div>
                        <div className="p-3">
                            <h1 className="text-3xl font-bold">{product.title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            <div className="md:flex gap-2 mt-2">
                                <p className="border px-4 py-1 w-fit mb-2 md:mb-0 rounded-full">
                                    {product.category_id && (
                                        'Category Name: ' + categories.find(cat => cat.id === product.category_id)?.name
                                    )}
                                </p>
                                <p className="border px-4 py-1 w-fit rounded-full">
                                    {product.sub_category_id && (
                                        'Sub Category Name: ' + sub_categories.find(cat => cat.id === product.sub_category_id)?.name
                                    )}
                                </p>
                            </div>
                            <div className="md:flex gap-2 mt-2">
                                <p className="border px-4 py-1 w-fit mb-2 md:mb-0 rounded-full">
                                    <b>Created at: </b>{convertUtcToLocal(product.created_at)}
                                </p>
                                <p className="border px-4 py-1 w-fit rounded-full">
                                    <b>Updated at: </b>{convertUtcToLocal(product.updated_at)}
                                </p>
                            </div>
                            {product.type === 'simple' && product.variations.map((variation) => (
                                <div key={variation.id} className="flex gap-2 mt-2 ">

                                    <div className="flex flex-col gap-y-2">
                                        <div className="flex gap-2">
                                            <div className="px-4 py-1 w-fit rounded-full" style={{ backgroundColor: variation.color }}>{variation.color}</div>
                                            <div className="px-4 py-1 w-fit border rounded-full">{variation.sizes}</div>
                                        </div>
                                        <p className="px-4 py-1 w-fit border rounded-full">
                                            <b>Price: </b>
                                            {variation.price}
                                        </p>
                                        {variation.sale_price && (
                                            <div className="flex gap-2">
                                                <p className="px-4 py-1 w-fit border rounded-full">
                                                    <b>Sale Price: </b>
                                                    {variation.sale_price}
                                                </p>
                                                <p className="px-4 py-1 w-fit border rounded-full">
                                                    <b>Sale Start At: </b>
                                                    {convertUtcToLocalDate(variation.sale_start_at)}
                                                </p>
                                                <p className="px-4 py-1 w-fit border rounded-full">
                                                    <b>Sale End At: </b>
                                                    {convertUtcToLocalDate(variation.sale_end_at)}
                                                </p>
                                            </div>
                                        )}
                                        <p className="px-4 py-1 w-fit border rounded-full">
                                            <b>Quantity: </b>
                                            {variation.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <p>{product.type === 'variable' && 'Variation Details:'}</p>
                {product.type === 'variable' && product.variations.map((variation) => (
                    <div key={variation.id} className="rounded-lg border p-3 flex justify-between">
                        <div className=" md:flex gap-y-2 md:gap-2">
                            <div className=" relative group md:w-1/6">
                                <img src={`/storage/${variation.image_path}`} alt={product.title} className="rounded-lg w-full" />
                                <div
                                    className="absolute cursor-pointer top-2 right-2 z-20 p-1 bg-gray-900/15 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <PenIcon onClick={() => {
                                        setShowEditImageModal(!showEditImageModal)
                                        setModalImageData({
                                            id: variation.id,
                                            type: 'variant',
                                        });
                                    }} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <div className="flex gap-2">
                                    <div className="px-4 py-1 w-fit rounded-full" style={{ backgroundColor: variation.color }}>{variation.color}</div>
                                    <div className="px-4 py-1 w-fit border rounded-full">{variation.sizes}</div>
                                </div>
                                <p className="px-4 py-1 w-fit border rounded-full">
                                    <b>Price: </b>
                                    {variation.price}
                                </p>
                                {variation.sale_price && (
                                    <div className="md:flex gap-2">
                                        <p className="px-4 py-1 w-fit border rounded-full md:mb-0 mb-2">
                                            <b>Sale Price: </b>
                                            {variation.sale_price}
                                        </p>
                                        <p className="px-4 py-1 w-fit border rounded-full md:mb-0 mb-2">
                                            <b>Sale Start At: </b>
                                            {convertUtcToLocalDate(variation.sale_start_at)}
                                        </p>
                                        <p className="px-4 py-1 w-fit border rounded-full">
                                            <b>Sale End At: </b>
                                            {convertUtcToLocalDate(variation.sale_end_at)}
                                        </p>
                                    </div>
                                )}
                                <p className="px-4 py-1 w-fit border rounded-full">
                                    <b>Quantity: </b>
                                    {variation.quantity}
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <PenBox className="h-5 cursor-pointer" onClick={() => {
                                setShowVariationModal(!showEditVariationModal)
                                setSelectedVariantData(variation)
                            }} />
                            <Trash2
                                className="text-red-700 h-5 cursor-pointer"
                                onClick={() => {
                                    setselectedDeleteVariantId(variation.id)
                                    setShowConfirmModal(!showConfirmModal)
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {showEditProductModal &&
                <EditProductModal
                    open={showEditProductModal}
                    onOpenChange={setShowProductModal}
                    categories={categories}
                    sub_categories={sub_categories}
                    data={product}
                />
            }
            {showEditVariationModal &&
                <EditVariationModal
                    open={showEditVariationModal}
                    onOpenChange={setShowVariationModal}
                    data={seletedVariantData}
                />
            }
            {showEditImageModal &&
                <EditImageModal
                    open={showEditImageModal}
                    onOpenChange={setShowEditImageModal}
                    data={modalImageData}
                />
            }
            {showConfirmModal &&
                <ConfirmDialogBox
                    open={showConfirmModal}
                    onOpenChange={setShowConfirmModal}
                    title="Delete Product Variant"
                    description="Are you sure you want to delete this product Variant? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDelete}
                    loading={loading}
                />
            }
        </AppLayout>
    );
}