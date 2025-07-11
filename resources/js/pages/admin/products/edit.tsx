import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Category, Product } from "@/types/data";
import { Head } from "@inertiajs/react";

type Props = {
    categories: Category[],
    sub_categories: Category[],
    product: Product
};

export default function EditProduct({ categories, sub_categories, product }: Props){
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Edit Product', href: `/admin/product/edit/${product.id}` }];
    console.log(product);
    return(
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />
            {/* Page here */}
        </AppLayout>
    );
}