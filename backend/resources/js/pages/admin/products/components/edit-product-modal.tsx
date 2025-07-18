import CustomTextEditor from "@/components/custom/custom-text-editor";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/data";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Product } from "../edit";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { socialMediaPlatforms } from "@/constant/social";

interface EditProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
    sub_categories: Category[];
    data: Product;
}

export default function EditProductModal({
    open,
    onOpenChange,
    categories,
    sub_categories,
    data,
}: EditProductModalProps) {
    console.log(data);
    const { data: formData, setData, put, errors } = useForm({
        title: data.title,
        description: data.description,
        categoryId: data.category_id,
        subCategoryId: data.sub_category_id,
        price: data.variations[0].price,
        salePrice: data.variations[0].sale_price,
        saleStartAt: data.variations[0].sale_start_at,
        saleEndAt: data.variations[0].sale_end_at,
        size: data.variations[0].sizes,
        quantity: data.variations[0].quantity,
        color: data.variations[0].color,
        social_link: data.social_links ?? [],
    });

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [openParent, setOpenParent] = useState(false);
    const [openSub, setOpenSub] = useState(false);
    const [loading, setLoading] = useState(false);
    const [onSale, setOnSale] = useState(!!data.variations[0].sale_price);

    const selectedParent = categories.find((cat) => cat.id === formData.categoryId);
    const showsSubCategory = sub_categories.filter((cat) => cat.parent_id === formData.categoryId);
    const selectedSub = showsSubCategory.find((cat) => cat.id === formData.subCategoryId);
    const hasSubCategory = formData.categoryId !== null;

    function handleColorPickerBlur(e: React.FocusEvent<HTMLDivElement>) {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setShowColorPicker(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        put(route("admin.product.update", data.id), {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
        onOpenChange(!open)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-screen overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-lg">Edit Product</DialogTitle>
                    <DialogDescription className="text-sm">
                        Update your product details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto max-h-[70vh] space-y-4 pr-2"
                >
                    {/* Title */}
                    <div className="grid gap-2">
                        <Label htmlFor="title">Product Title*</Label>
                        <Input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        <InputError message={errors.title} />
                    </div>

                    {/* Description */}
                    <div className="grid gap-2">
                        <Label>Product Description*</Label>
                        <CustomTextEditor
                            initialValue={formData.description}
                            onChange={(html) => setData("description", html)}
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Categories */}
                    <div className="flex w-full gap-2">
                        <div className="grid gap-2 w-1/2">
                            <Label>Category*</Label>
                            <Popover open={openParent} onOpenChange={setOpenParent}>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                                        aria-expanded={openParent}
                                    >
                                        {selectedParent ? selectedParent.name : "Select category..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search..." />
                                        <CommandEmpty>No category found.</CommandEmpty>
                                        <CommandGroup>
                                            {formData.categoryId && (
                                                <CommandItem
                                                    value="none"
                                                    onSelect={() => {
                                                        setData("categoryId", null);
                                                        setData("subCategoryId", null);
                                                        setOpenParent(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", !formData.categoryId ? "opacity-100" : "opacity-0")} />
                                                    Deselect
                                                </CommandItem>
                                            )}
                                            {categories.map((category) => (
                                                <CommandItem
                                                    key={category.id}
                                                    value={category.name}
                                                    onSelect={() => {
                                                        setData("categoryId", category.id);
                                                        setData("subCategoryId", null);
                                                        setOpenParent(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", formData.categoryId === category.id ? "opacity-100" : "opacity-0")} />
                                                    {category.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.categoryId} />
                        </div>

                        {hasSubCategory && (
                            <div className={`grid w-1/2 gap-2 ${!formData.categoryId ? "pointer-events-none opacity-50" : ""}`}>
                                <Label>Sub Category</Label>
                                <Popover open={openSub} onOpenChange={setOpenSub}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                                            aria-expanded={openSub}
                                        >
                                            {selectedSub ? selectedSub.name : "Select sub-category..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search..." />
                                            <CommandEmpty>No sub-category found.</CommandEmpty>
                                            <CommandGroup>
                                                {formData.subCategoryId && (
                                                    <CommandItem
                                                        value="none"
                                                        onSelect={() => {
                                                            setData("subCategoryId", null);
                                                            setOpenSub(false);
                                                        }}
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4", !formData.subCategoryId ? "opacity-100" : "opacity-0")} />
                                                        Deselect
                                                    </CommandItem>
                                                )}
                                                {showsSubCategory.map((category) => (
                                                    <CommandItem
                                                        key={category.id}
                                                        value={category.name}
                                                        onSelect={() => {
                                                            setData("subCategoryId", category.id);
                                                            setOpenSub(false);
                                                        }}
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4", formData.subCategoryId === category.id ? "opacity-100" : "opacity-0")} />
                                                        {category.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors.subCategoryId} />
                            </div>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="grid gap-2">
                        <Label>Social Links</Label>
                        {formData.social_link.map((link, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <div className="w-1/2">
                                    <Label htmlFor={`social_link[${index}].platform`}>Platform</Label>
                                    <Popover >
                                        <PopoverTrigger asChild>
                                            <button
                                                type="button"
                                                className="w-full flex items-center justify-between rounded border px-3 py-2 text-sm"
                                            >
                                                {link.platform || 'Select Platform...'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full h-60 p-0">
                                            <Command>
                                                <CommandInput placeholder="Search..." />
                                                <CommandEmpty>No platform found.</CommandEmpty>
                                                <CommandGroup>
                                                    {socialMediaPlatforms.map((social) => (
                                                        <CommandItem
                                                            key={social}
                                                            value={social}
                                                            onSelect={() => {
                                                                const updatedLinks = formData.social_link.map((l, i) =>
                                                                    i === index ? { ...l, platform: social } : l
                                                                );
                                                                setData('social_link', updatedLinks);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    link.platform === social ? 'opacity-100' : 'opacity-0'
                                                                )}
                                                            />
                                                            {social}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors[`social_link.${index}.platform`]} />
                                </div>

                                <div className="w-1/2">
                                    <Label htmlFor={`social_link[${index}].url`}>URL</Label>
                                    <Input
                                        id={`social_link[${index}].url`}
                                        type="url"
                                        placeholder="https://..."
                                        value={link.url}
                                        onChange={(e) =>
                                            setData(
                                                'social_link',
                                                formData.social_link.map((l, i) =>
                                                    i === index ? { ...l, url: e.target.value } : l
                                                )
                                            )
                                        }
                                    />
                                    <InputError message={errors[`social_link.${index}.url`]} />
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="mt-6"
                                    onClick={() =>
                                        setData(
                                            'social_link',
                                            formData.social_link.filter((_, i) => i !== index)
                                        )
                                    }
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setData('social_link', [
                                    ...formData.social_link,
                                    { platform: '', url: '' },
                                ])
                            }
                        >
                            Add Social Link
                        </Button>
                    </div>

                    {data.type === "simple" && (
                        <>

                            <div className="flex gap-2">
                                {data.variations[0].sizes && (
                                    <div className="grid gap-2 w-1/2">
                                        <Label htmlFor="sizes">Product Size*</Label>
                                        <Input
                                            id="sizes"
                                            type="text"
                                            value={formData.size}
                                            onChange={(e) => setData("size", e.target.value)}
                                        />
                                        <InputError message={errors.size} />
                                    </div>
                                )}
                                <div className={`grid gap-2 ${data.variations[0].sizes ? 'w-1/2' : 'w-full'}`}>
                                    <Label htmlFor="quantity">Product Quantity*</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setData("quantity", +e.target.value)}
                                    />
                                    <InputError message={errors.quantity} />
                                </div>
                            </div>


                            {/* Color Picker */}
                            {data.variations[0].color && (
                                <div className="grid gap-2">
                                    <Label>Product Color*</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative" tabIndex={0} onBlur={handleColorPickerBlur}>
                                            <div
                                                className="h-10 w-10 rounded-md border cursor-pointer"
                                                style={{ backgroundColor: formData.color }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowColorPicker(!showColorPicker);
                                                }}
                                            />
                                            {showColorPicker && (
                                                <div className="absolute -top-48 right-64 left-0 z-20 -translate-x-1/2 shadow-lg">
                                                    <HexColorPicker color={formData.color} onChange={(color) => setData("color", color)} />
                                                </div>
                                            )}
                                        </div>
                                        <Input value={formData.color} onChange={(e) => setData("color", e.target.value)} />
                                    </div>
                                    <InputError message={errors.color} />
                                </div>
                            )}



                            {/* Sale Toggle & Pricing */}
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="onSale"
                                        checked={onSale}
                                        onChange={(e) => setOnSale(e.target.checked)}
                                    />
                                    <Label htmlFor="onSale">On Sale</Label>
                                </div>
                                <div className="flex gap-2">
                                    <div className={`${onSale ? "w-1/2" : "w-full"} transition-all duration-300`}>
                                        <Label>Price*</Label>
                                        <Input type="number" value={formData.price} onChange={(e) => setData("price", e.target.value)} />
                                        <InputError message={errors.price} />
                                    </div>
                                    {onSale && (
                                        <div className="w-1/2">
                                            <Label>Sale Price</Label>
                                            <Input type="number" value={formData.salePrice} onChange={(e) => setData("salePrice", e.target.value)} />
                                            <InputError message={errors.salePrice} />
                                        </div>
                                    )}
                                </div>
                                {onSale && (
                                    <div className="flex gap-2 transition-all duration-150">
                                        <div className="w-1/2">
                                            <Label>Sale Start</Label>
                                            <Input type="date" value={formData.saleStartAt} onChange={(e) => setData("saleStartAt", e.target.value)} />
                                            <InputError message={errors.saleStartAt} />
                                        </div>
                                        <div className="w-1/2">
                                            <Label>Sale End</Label>
                                            <Input type="date" value={formData.saleEndAt} onChange={(e) => setData("saleEndAt", e.target.value)} />
                                            <InputError message={errors.saleEndAt} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <DialogFooter>
                        <Button type="submit" className="w-full">
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
