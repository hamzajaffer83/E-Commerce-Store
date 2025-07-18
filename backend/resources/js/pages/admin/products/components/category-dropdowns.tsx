import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Category } from '@/types/data';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface Props {
    parent_category?: Category[];
    parentValue: number | null;
    setParentValue: (value: number | null) => void;
    sub_category?: Category[];
    subCategoryValue: number | null;
    setSubCategoryValue: (value: number | null) => void;
}

const CategoryDropdown = ({ parent_category = [], parentValue, setParentValue, sub_category = [], subCategoryValue, setSubCategoryValue }: Props) => {
    const [openParent, setOpenParent] = useState(false);
    const [openSub, setOpenSub] = useState(false);
    const [hasSubCategory, setHasSubCategory] = useState(false);

    const selectedParent = parent_category.find((cat) => cat.id === parentValue);
    const showsSubCategory = sub_category.filter((cat) => cat.parent_id === parentValue);
    const selectedSub = showsSubCategory.find((cat) => cat.id === subCategoryValue);

    return (
        <>
            <div className="w-full gap-4 sm:flex">
                {/* Parent Category */}
                <div className={`grid gap-2 ${hasSubCategory ? 'sm:w-1/2' : 'w-full'}`}>
                    <Label>Category*</Label>
                    <Popover open={openParent} onOpenChange={setOpenParent}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                                aria-expanded={openParent}
                            >
                                {selectedParent ? selectedParent.name : 'Select category...'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search..." />
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                    {parentValue && (
                                        <CommandItem
                                            value="none"
                                            onSelect={() => {
                                                setParentValue(null);
                                                setSubCategoryValue(null);
                                                setOpenParent(false);
                                            }}
                                        >
                                            <Check className={cn('mr-2 h-4 w-4', !parentValue ? 'opacity-100' : 'opacity-0')} />
                                            Deselect
                                        </CommandItem>
                                    )}
                                    {parent_category.map((category) => (
                                        <CommandItem
                                            key={category.id}
                                            value={category.name}
                                            onSelect={() => {
                                                setParentValue(category.id);
                                                setSubCategoryValue(null); // clear sub if parent changes
                                                setOpenParent(false);
                                            }}
                                        >
                                            <Check className={cn('mr-2 h-4 w-4', parentValue === category.id ? 'opacity-100' : 'opacity-0')} />
                                            {category.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Sub Category */}
                {hasSubCategory && (
                    <div className={`grid w-full gap-2 sm:w-1/2 ${!parentValue ? 'pointer-events-none opacity-50' : ''}`}>
                        <Label>Sub Category</Label>
                        <Popover open={openSub} onOpenChange={setOpenSub}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                                    aria-expanded={openSub}
                                >
                                    {selectedSub ? selectedSub.name : 'Select sub-category...'}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search..." />
                                    <CommandEmpty>No sub-category found.</CommandEmpty>
                                    <CommandGroup>
                                        {subCategoryValue && (
                                            <CommandItem
                                                value="none"
                                                onSelect={() => {
                                                    setSubCategoryValue(null);
                                                    setOpenSub(false);
                                                }}
                                            >
                                                <Check className={cn('mr-2 h-4 w-4', !subCategoryValue ? 'opacity-100' : 'opacity-0')} />
                                                Deselect
                                            </CommandItem>
                                        )}
                                        {showsSubCategory.map((category) => (
                                            <CommandItem
                                                key={category.id}
                                                value={category.name}
                                                onSelect={() => {
                                                    setSubCategoryValue(category.id);
                                                    setOpenSub(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn('mr-2 h-4 w-4', subCategoryValue === category.id ? 'opacity-100' : 'opacity-0')}
                                                />
                                                {category.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>

            {/* Has Sub Category Checkbox */}
            <div className={`flex items-center space-x-2 ${selectedSub && 'pointer-events-none opacity-50'}`}>
                <Checkbox
                    id="hasSubCategory"
                    name="hasSubCategory"
                    checked={hasSubCategory}
                    onCheckedChange={(checked) => {
                        setHasSubCategory(!!checked);
                        if (!checked) {
                            setSubCategoryValue(null);
                        }
                    }}
                />
                <Label htmlFor="hasSubCategory">Has Sub Category</Label>
            </div>
        </>
    );
};

export default CategoryDropdown;
