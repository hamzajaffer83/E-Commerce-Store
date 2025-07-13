import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogBoxProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    loading?: boolean;
}

export default function ConfirmDialogBox({
    open,
    onOpenChange,
    title = "Are you sure?",
    description = "Please confirm this action.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    loading = false,
}: ConfirmDialogBoxProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-screen overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-lg">{title}</DialogTitle>
                    <DialogDescription className="text-sm">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col space-y-2">
                    <Button
                        onClick={onConfirm}
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : confirmText}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full"
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
