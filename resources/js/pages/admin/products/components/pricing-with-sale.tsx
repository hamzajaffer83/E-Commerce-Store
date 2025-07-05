import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface PricingWithSaleProps {
    data: { price: string; sale_price: string; sale_start_at: string; sale_end_at: string };
    setData: (key: 'price' | 'sale_price' | 'sale_start_at' | 'sale_end_at', value: any) => void;
    errors: { price?: string; sale_price?: string; sale_start_at?: string; sale_end_at?: string };
}

export default function PricingWithSale({ data, setData, errors }: PricingWithSaleProps) {
    const [hasSalePrice, setHasSalePrice] = useState<boolean>(false);
    return (
        <div className="">
            <div className="">
                {/* Price and Sale Price */}
                <div className="w-full gap-4 sm:flex sm:pb-2">
                    <div className={`mb-3 grid gap-2 sm:mb-0 transition-all duration-75  ${hasSalePrice ? 'sm:w-1/2' : 'w-full'}`}>
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
                    {hasSalePrice && (
                        <div className={`mb-3 grid gap-2 sm:mb-0 sm:w-1/2 ${!data.price && 'pointer-events-none opacity-50'}`}>
                            <Label htmlFor="sale_price">Sale Price</Label>
                            <Input
                                id="sale_price"
                                type="number"
                                required
                                value={data.sale_price}
                                onChange={(e) => setData('sale_price', e.target.value)}
                                placeholder="899"
                            />
                            <InputError message={errors.sale_price} />
                        </div>
                    )}
                </div>
                <div className={`flex items-center space-x-2 pb-2 ${data.sale_price && 'pointer-events-none opacity-50'}`}>
                    <Checkbox
                        id="hasSalePrice"
                        name="hasSalePrice"
                        checked={hasSalePrice}
                        onCheckedChange={(checked) => {
                            setHasSalePrice(!!checked);
                            setData('sale_price', ''); // Reset sale price when toggling
                            setData('sale_start_at', '');
                            setData('sale_end_at', '');
                            if (!checked) {
                                setHasSalePrice(false);
                            }
                        }}
                    />
                    <Label htmlFor="hasSalePrice">Has Sale Price</Label>
                </div>
            </div>
            {hasSalePrice && (
                <div className={`w-full gap-4 sm:flex ${!data.sale_price && 'pointer-events-none opacity-50'}`}>
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
                            required
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
            {data.sale_start_at && data.sale_end_at && (
                <div className="mt-2 text-sm text-gray-500">
                    Sale is active from {new Date(data.sale_start_at).toLocaleDateString()} to{' '}
                    {new Date(data.sale_end_at).toLocaleDateString()}.
                </div>
            )}
            {!data.sale_start_at && data.sale_end_at && (
                <div className="mt-2 text-sm text-gray-500">
                    Sale is active till {new Date(data.sale_end_at).toLocaleDateString()}.
                </div>
            )}
        </div>
    );
}
