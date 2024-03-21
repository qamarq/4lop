import { CheckCircle2Icon } from 'lucide-react';
import React, { useMemo } from 'react';

export default function StepperComponent({
    completed,
    all,
}: {
    completed: number;
    all: number;
}) {
    const isCompleted = useMemo(() => {
        return completed >= all;
    }, [completed, all]);

    return (
        <>
            {isCompleted ? (
                <div className="flex items-center gap-1 py-[3px] px-[8px] rounded-full bg-primary text-white">
                    <CheckCircle2Icon size={12} />
                    <p className="text-xs font-medium">{completed}/{all}</p>
                </div>
            ) : (
                <div className="flex items-center gap-1 py-[3px] px-[8px] rounded-full border">
                    <div className="flex items-center gap-[2px]">
                        {Array.from({ length: completed }).map((_, index) => (
                            <span
                                key={index}
                                className="w-[10px] h-[3px] bg-primary rounded-full"
                            ></span>
                        ))}
                        {Array.from({ length: all - completed }).map((_, index) => (
                            <span
                                key={index}
                                className="w-[10px] h-[3px] bg-slate-200 rounded-full"
                            ></span>
                        ))}
                    </div>
                    <span className="bg-slate-400 h-[12px] rounded-lg min-w-[1px]"></span>
                    <p className="text-xs font-medium">{completed}/{all}</p>
                </div>
            )}
        </>
    );
}
