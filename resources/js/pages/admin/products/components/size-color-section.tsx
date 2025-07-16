import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

type SizeColorSectionProps = {
    data: { sizes: string[]; color: string };
    setData: (key: 'sizes' | 'color', value: any) => void;
    errors: { sizes?: string; color?: string };
};

export default function SizeColorSection({ data, setData, errors }: SizeColorSectionProps) {
    const initialSize = data.sizes.length > 0 ? data.sizes[0] : '';
    const [sizeInput, setSizeInput] = useState<string>(initialSize);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleSizeChange = (value: string) => {
        setSizeInput(value);
        setData('sizes', value.trim() ? [value.trim()] : []);
    };

    function handleColorPickerBlur(e: React.FocusEvent<HTMLDivElement>) {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setShowColorPicker(false);
        }
    }

    return (
        <div className="w-full gap-4 sm:flex" onClick={() => setShowColorPicker(false)}>
            {/* Size Input */}
            <div className="sm:w-1/2">
                <div className="grid gap-2">
                    <Label>Size</Label>
                    <Input
                        type="text"
                        value={sizeInput}
                        placeholder="Enter size (e.g. M, 42, etc.)"
                    />
                    <InputError message={errors.sizes} />
                </div>
            </div>

            {/* Color Picker */}
            <div className="sm:w-1/2">
                <div className="relative grid gap-2">
                    <Label htmlFor="color">Color</Label>
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
                                    <HexColorPicker
                                        color={data.color || '#000000'}
                                        onChange={(color) => setData('color', color)}
                                    />
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
