'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantityButtonProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min?: number;
    max?: number;
}

export default function QuantityButton({
   quantity,
   onIncrease,
   onDecrease,
   min = 1,
   max = Infinity
}: QuantityButtonProps) {
    return (
        <div className="inline-flex h-fit items-center gap-2 bg-gray-100 rounded-md px-[9px] py-1 shadow-sm">
            <Button
                variant="ghost"
                size="icon"
                onClick={onDecrease}
                disabled={quantity <= min}
                className="hover:bg-red-100 text-red-500"
            >
                <Minus size={16} />
            </Button>
            <span className="font-medium text-base w-6 text-center">{quantity}</span>
            <Button
                variant="ghost"
                size="icon"
                onClick={onIncrease}
                disabled={quantity >= max}
                className="hover:bg-green-100 text-green-600"
            >
                <Plus size={16} />
            </Button>
        </div>
    );
}
