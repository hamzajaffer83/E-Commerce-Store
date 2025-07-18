import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PricingWithSale from './pricing-with-sale';
import SizeColorSection from './size-color-section';

type SimpleProductData = {
    sizes: string[];
    color: string;
    price: string;
    sale_price: string;
    sale_start_at: string;
    sale_end_at: string;
    quantity: number | null;
};

type SimpleProductErrors = {
    sizes?: string;
    color?: string;
    price?: string;
    sale_price?: string;
    sale_start_at?: string;
    sale_end_at?: string;
    quantity?: string;
};

interface Props {
    data: SimpleProductData;
    setData: (field: keyof SimpleProductData, value: any) => void;
    errors: SimpleProductErrors;
}

export default function SimpleProduct({ data, setData, errors }: Props) {
    return (
        <>
            <SizeColorSection data={data} setData={setData} errors={errors} />
            <PricingWithSale data={data} setData={setData} errors={errors} />
            <div className="mb-3 grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                    id="quantity"
                    type="number"
                    value={data.quantity ?? ''}
                    onChange={(e) => setData('quantity', e.target.value)}
                    placeholder="100"
                />
                <InputError message={errors.quantity} />
            </div>
        </>
    );
}
