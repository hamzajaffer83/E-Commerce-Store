import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

interface Data {
    id: number | null;
    type: 'cover' | 'variant' | 'image';
}

interface EditVariationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: Data;
}

export default function EditImageModal({
    open,
    onOpenChange,
    data,
}: EditVariationModalProps) {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ file?: string }>({});

    console.log(data);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        if (!file || !data.id || !data.type) {
            setErrors({ file: "Please select a file." });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("id", data.id.toString());
        formData.append("type", data.type);
        formData.append("file", file);

        router.post(route("admin.product.image.update"), formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                setLoading(false);
                onOpenChange(false); // Close modal after upload
            },
            onError: (err) => {
                setErrors({ file: err.file });
            }
        });
        onOpenChange(!open)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-screen overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-lg">Edit Product Image</DialogTitle>
                    <DialogDescription className="text-sm">
                        Update your product image. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto max-h-[70vh] space-y-4 pr-2"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="image">Product Image*</Label>
                        <Input
                            id="image"
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <InputError message={errors?.file} />
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
