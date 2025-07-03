import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VariantPricingProps {
    data: { quantity?: number; sku?: string };
    setData: (key: 'quantity' | 'sku', value: number | string) => void;
    errors: { quantity?: string; sku?: string };
}

export default function QuantitySkuVariant({ data, setData, errors }: VariantPricingProps) {
    return (
        <div>
            <div className="w-full gap-4 py-2 sm:flex">
                {/* Quantity */}
                <div className="mb-3 grid w-full gap-2 transition-all duration-75 sm:mb-0 sm:w-1/2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                        id="quantity"
                        type="number"
                        required
                        value={data.quantity}
                        onChange={(e) => setData('quantity', e.target.value)}
                        placeholder="999"
                    />
                    <InputError message={errors.quantity} />
                </div>

                <div className="mb-3 grid w-full gap-2 sm:mb-0 sm:w-1/2">
                    <Label htmlFor="sku">Stock Keeping Unit(SKU)</Label>
                    <Input id="sku" type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)} placeholder="" />
                    <InputError message={errors.sku} />
                </div>
            </div>
        </div>
    );
}
