import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VariableProductData } from '@/types/data';
import { VariableProductErrors } from '@/types/error';
import { Variant } from '@/types/helper';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import PricingWithSale from './pricing-with-sale';
import QuantitySkuVariant from './quantity-sku-variant';
import SizeColorVariant from './size-color-variant';
import VariantPricing from './variant-pricing';

interface Props {
    data: VariableProductData;
    setData: <K extends keyof VariableProductData>(field: K, value: VariableProductData[K]) => void;
    errors: VariableProductErrors;
}

export default function VariableProduct({ data, setData, errors }: Props) {
    const [isCommonPrice, setIsCommonPrice] = useState(false);

    const handleAddVariant = (e: React.FormEvent) => {
        e.preventDefault();
        const newVariant: Variant = {
            image: null,
            size: '',
            color: '#000000',
            price: '',
            sale_price: '',
            quantity: 0,
            sku: '',
        };
        setData('variants', [...data.variants, newVariant]);
    };

    const handleRemoveVariant = (index: number) => {
        setData(
            'variants',
            data.variants.filter((_, i) => i !== index),
        );
    };

    const handleVariantChange = (index: number, updated: Partial<Variant>) => {
        const next = data.variants.map((v, i) => (i === index ? { ...v, ...updated } : v));
        setData('variants', next);
    };

    return (
        <>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="mb-4 text-lg font-semibold">Product Variants</h3>
                <div className="flex items-center space-x-2 pb-2">
                    <Checkbox
                        id="hasSalePrice"
                        name="hasSalePrice"
                        checked={isCommonPrice}
                        onCheckedChange={(checked) => {
                            const enabled = !!checked;
                            setIsCommonPrice(enabled);

                            if (enabled) {
                                // Clear sale prices from variants when switching to common pricing
                                const clearedVariants = data.variants.map((variant) => ({
                                    ...variant,
                                    price: '',
                                    sale_price: '',
                                }));
                                setData('variants', clearedVariants);

                                // Clear common price data (to start fresh)
                                setData('sale_price', '');
                                setData('sale_start_at', '');
                                setData('sale_end_at', '');
                                setData('price', '');
                            }
                        }}
                    />
                    <Label htmlFor="hasSalePrice">Common price</Label>
                </div>
                <Button onClick={handleAddVariant} className="cursor-pointer">
                    Add New Variant
                </Button>
            </div>

            {isCommonPrice && <PricingWithSale data={data} setData={setData} errors={errors} />}

            {data.variants.map((variant, idx) => (
                <div key={idx} className="relative mb-4 rounded border p-4">
                    <h4 className="mb-2 font-semibold">Variant {idx + 1}</h4>

                    <button
                        type="button"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveVariant(idx)}
                        title="Remove Variant"
                    >
                        <Trash2 size={18} />
                    </button>

                    <div className="grid gap-2">
                        <Label htmlFor="variant_image">Variant Image</Label>
                        <Input
                            id="variant_image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                handleVariantChange(idx, { image: file });
                            }}
                        />
                        <InputError message={errors.variants?.[idx]?.image} />
                    </div>
                    <SizeColorVariant
                        data={variant}
                        onSizeChange={(val) => handleVariantChange(idx, { size: val })}
                        onColorChange={(val) => handleVariantChange(idx, { color: val })}
                        errors={errors.variants?.[idx] ?? {}}
                    />
                    {!isCommonPrice && (
                        <VariantPricing
                            data={variant}
                            setData={(key, value) => handleVariantChange(idx, { [key]: value })}
                            errors={errors.variants?.[idx] ?? {}}
                        />
                    )}
                    <QuantitySkuVariant
                        data={variant}
                        setData={(key, value) => handleVariantChange(idx, { [key]: value })}
                        errors={errors.variants?.[idx] ?? {}}
                    />
                </div>
            ))}

            {!isCommonPrice && (
                <div className={`w-full gap-4 sm:flex ${data.variants.some((v) => v.sale_price) ? '' : 'pointer-events-none opacity-50'}`}>
                    <div className="mb-3 grid gap-2 sm:mb-0 sm:w-1/2">
                        <Label htmlFor="sale_start">Sale Start</Label>
                        <Input
                            id="sale_start"
                            type="date"
                            value={data.sale_start_at}
                            onChange={(e) => setData('sale_start_at', e.target.value)}
                        />
                        <InputError message={errors.sale_start_at} />
                    </div>
                    <div className="mb-3 grid gap-2 sm:mb-0 sm:w-1/2">
                        <Label htmlFor="sale_end">Sale End</Label>
                        <Input
                            id="sale_end"
                            type="date"
                            value={data.sale_end_at}
                            onChange={(e) => setData('sale_end_at', e.target.value)}
                        />
                        <InputError message={errors.sale_end_at} />
                        {data.sale_start_at && data.sale_start_at >= data.sale_end_at && (
                            <InputError message="Sale end date must be after the sale start date." />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
