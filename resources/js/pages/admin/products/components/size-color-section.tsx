import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

type SizeColorSectionProps = {
    data: { sizes: string[]; color: string };
    setData: (key: 'sizes' | 'color', value: any) => void;
    errors: { sizes?: string; color?: string };
};

export default function SizeColorSection({ data, setData, errors }: SizeColorSectionProps) {
    const [sizeInputs, setSizeInputs] = useState<string[]>(data.sizes.length ? data.sizes : ['']);
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Keep parent state in sync with local sizeInputs
    const handleSizeChange = (idx: number, value: string) => {
        const updated = [...sizeInputs];
        updated[idx] = value;
        setSizeInputs(updated);
        setData(
            'sizes',
            updated.filter((s) => s.trim() !== ''),
        );
    };

    function handleColorPickerBlur(e: React.FocusEvent<HTMLDivElement>) {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setShowColorPicker(false);
        }
    }

    const addSizeInput = () => {
        setSizeInputs([...sizeInputs, '']);
    };

    const removeSizeInput = (idx: number) => {
        const updated = sizeInputs.filter((_, i) => i !== idx);
        setSizeInputs(updated);
        setData(
            'sizes',
            updated.filter((s) => s.trim() !== ''),
        );
    };

    return (
        <div className="w-full gap-4 sm:flex" onClick={() => setShowColorPicker(false)}>
            {/* Size Inputs */}
            <div className="sm:w-1/2">
                <div className="grid gap-2">
                    <Label>Sizes*</Label>
                    <div className="flex flex-col gap-2">
                        {sizeInputs.map((size, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    required
                                    value={size}
                                    onChange={(e) => handleSizeChange(idx, e.target.value)}
                                    placeholder={`Size #${idx + 1}`}
                                />
                                {sizeInputs.length > 1 && (
                                    <button type="button" onClick={() => removeSizeInput(idx)} className="cursor-pointer px-2 text-red-500">
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addSizeInput} className="my-1 flex cursor-pointer items-center gap-1 text-blue-600">
                            <Plus className="h-4 w-4" /> Add Size
                        </button>
                    </div>
                    <InputError message={errors.sizes} />
                </div>
            </div>

            {/* Color Picker */}
            <div className="sm:w-1/2">
                <div className="relative grid gap-2">
                    <Label htmlFor="color">Color*</Label>
                    <div className="flex items-center gap-2">
                        <div className="relative h-full" tabIndex={0} onBlur={handleColorPickerBlur}>
                            <div
                                className="h-full w-10 cursor-pointer rounded-md border"
                                style={{ backgroundColor: data.color || '#000000' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowColorPicker((v) => !v);
                                }}
                                tabIndex={0}
                                aria-label="Pick color"
                            />
                            {showColorPicker && (
                                <div className="absolute -top-48 left-1/2 z-20 -translate-x-1/2 shadow-lg" tabIndex={0}>
                                    <HexColorPicker color={data.color || '#000000'} onChange={(color) => setData('color', color)} />
                                </div>
                            )}
                        </div>
                        <Input
                            type="text"
                            value={data.color}
                            onChange={(e) => setData('color', e.target.value)}
                            placeholder="#000000"
                            className="w-full"
                        />
                    </div>
                    <InputError message={errors.color} />
                </div>
            </div>
        </div>
    );
}
