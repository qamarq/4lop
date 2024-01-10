import { cn } from "@/lib/utils";
import { AlertTriangleIcon } from "lucide-react";

interface FormErrorProps {
    message?: string
    className?: string
}

export const FormError = ({ className, message }: FormErrorProps) => {
    if (!message) return null

    return (
        <div className={cn("bg-destructive/15 p-3 rounded-md w-full flex items-center gap-x-2 text-sm text-destructive", className)}>
            <AlertTriangleIcon className="h-4 w-4" />
            <p className="font-medium">{message}</p>
        </div>
    )
}