import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface VariantPricingProps {
    data: { price?: string; sale_price?: string };
    setData: (key: 'price' | 'sale_price', value: string) => void;
    errors: { price?: string; sale_price?: string };
}

export default function VariantPricing({ data, setData, errors }: VariantPricingProps) {
    const [hasSalePrice, setHasSalePrice] = useState<boolean>(!!data.sale_price);

    const price = parseFloat(data.price ?? '');
    const salePrice = parseFloat(data.sale_price ?? '');
    const showPriceError = !isNaN(price) && !isNaN(salePrice) && salePrice >= price;

    return (
        <div>
            <div className="w-full gap-4 py-2 sm:flex">
                {/* Price */}
                <div className={`mb-3 grid gap-2 transition-all duration-75 sm:mb-0 ${hasSalePrice ? 'sm:w-1/2' : 'w-full'}`}>
                    <Label htmlFor="price">Price*</Label>
                    <Input
                        id="price"
                        type="number"
                        required
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        placeholder="999"
                    />
                    <InputError message={errors.price} />
                </div>

                {/* Sale Price */}
                {hasSalePrice && (
                    <div className={`mb-3 grid gap-2 sm:mb-0 sm:w-1/2 ${!data.price && 'pointer-events-none opacity-50'}`}>
                        <Label htmlFor="sale_price">Sale Price</Label>
                        <Input
                            id="sale_price"
                            type="number"
                            value={data.sale_price}
                            onChange={(e) => setData('sale_price', e.target.value)}
                            placeholder="899"
                        />
                        <InputError message={errors.sale_price} />
                        {showPriceError && <InputError message="Sale price cannot be greater than or equal to the regular price." />}
                    </div>
                )}
            </div>

            {/* Checkbox */}
            <div className={`flex items-center space-x-2 pb-2 ${data.sale_price && !hasSalePrice && 'pointer-events-none opacity-50'}`}>
                <Checkbox
                    id="hasSalePrice"
                    name="hasSalePrice"
                    checked={hasSalePrice}
                    onCheckedChange={(checked) => {
                        const isChecked = typeof checked === 'boolean' ? checked : Boolean(checked);
                        setHasSalePrice(isChecked);
                        if (!isChecked) setData('sale_price', '');
                    }}
                />
                <Label htmlFor="hasSalePrice">Has Sale Price</Label>
            </div>
        </div>
    );
}
