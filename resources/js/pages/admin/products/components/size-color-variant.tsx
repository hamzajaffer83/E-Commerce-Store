import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

type SizeColorVariantProps = {
  data: { size: string; color: string };
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
  errors: { size?: string; color?: string };
};

export default function SizeColorVariant({
  data,
  onSizeChange,
  onColorChange,
  errors,
}: SizeColorVariantProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setShowColorPicker(false);
    }
  };

  return (
    <div className="w-full gap-4 py-2 sm:flex" onClick={() => setShowColorPicker(false)}>
      {/* Size */}
      <div className="sm:w-1/2">
        <div className="grid gap-2">
          <Label htmlFor="variant-size">Size*</Label>
          <Input
            id="variant-size"
            type="text"
            required
            value={data.size}
            onChange={(e) => onSizeChange(e.target.value)}
            placeholder="e.g. M, L, XL"
          />
          <InputError message={errors.size} />
        </div>
      </div>

      {/* Color Picker */}
      <div className="sm:w-1/2 mt-2 sm:mt-0">
        <div className="relative grid gap-2" onBlur={handleBlur} tabIndex={0}>
          <Label htmlFor="variant-color">Color*</Label>

          <div className="flex items-center gap-2">
            <div
              id="variant-color"
              className="h-10 w-10 rounded-md border cursor-pointer"
              style={{ backgroundColor: data.color }}
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker((v) => !v);
              }}
              title="Pick color"
            />

            <Input
              type="text"
              value={data.color}
              onChange={(e) => onColorChange(e.target.value)}
              placeholder="#000000"
              className="w-full"
            />
          </div>

          {showColorPicker && (
            <div className="absolute z-20 mt-2 -translate-x-1/2 left-1/2 shadow-lg">
              <HexColorPicker color={data.color} onChange={(c) => onColorChange(c)} />
            </div>
          )}

          <InputError message={errors.color} />
        </div>
      </div>
    </div>
  );
}
