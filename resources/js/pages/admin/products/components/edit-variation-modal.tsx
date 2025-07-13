import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Variant } from "../edit";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";

interface EditVariationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: Variant
}

export default function EditVariationModal({
    open,
    onOpenChange,
    data,
}: EditVariationModalProps) {
    const { data: formData, setData, put, errors } = useForm({
        price: data.price,
        salePrice: data.sale_price,
        saleStartAt: data.sale_start_at,
        saleEndAt: data.sale_end_at,
        size: data.sizes,
        quantity: data.quantity,
        color: data.color,
    });


    const [showColorPicker, setShowColorPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [onSale, setOnSale] = useState(!!data.sale_price);

    function handleColorPickerBlur(e: React.FocusEvent<HTMLDivElement>) {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setShowColorPicker(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        put(route("admin.variant.update", data.id), {
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
                        Update your variation details. Click save when you're done.
                    </DialogDescription>
                    <form
                        onSubmit={handleSubmit}
                        className="overflow-y-auto max-h-[70vh] space-y-4 pr-2"
                    >
                        <div className="flex gap-2">
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
                            <div className="grid gap-2 w-1/2">
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
                        <DialogFooter>
                            <Button type="submit" className="w-full">
                                {loading ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}