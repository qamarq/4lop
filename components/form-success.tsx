import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";

interface FormSuccessProps {
    message?: string
    className?: string
}

export const FormSuccess = ({ className, message }: FormSuccessProps) => {
    if (!message) return null

    return (
        <div className={cn("bg-emerald-500/15 p-3 w-full rounded-md flex items-center gap-x-2 text-sm text-emerald-500", className)}>
            <CheckCircleIcon className="h-4 w-4" />
            <p className="font-medium">{message}</p>
        </div>
    )
}