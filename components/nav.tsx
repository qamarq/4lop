'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { SidebarNavItem } from '@/types';
import React from 'react';

interface DashboardNavProps {
    items: SidebarNavItem[];
    messagesUnreadCount: number;
}

export function DashboardNav({ items, messagesUnreadCount }: DashboardNavProps) {
    const path = usePathname();

    if (!items?.length) {
        return null;
    }

    return (
        <nav className="grid items-start gap-1">
            {items.map((item, index) => {
                const Icon = Icons[item.icon || 'arrowRight'];
                return (
                    item.href && (
                        <React.Fragment key={index}>
                            {item.hrTop && <hr className="my-1" />}
                            <Link
                                href={item.disabled ? '/' : item.href}>
                                <span
                                    className={cn(
                                        'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                        path === item.href
                                            ? 'bg-accent'
                                            : 'transparent',
                                        item.disabled &&
                                            'cursor-not-allowed opacity-80'
                                    )}>
                                    <Icon className="mr-2 h-4 w-4 min-w-4" />
                                    <span>{item.title}</span>

                                    {item.messages && (
                                        <div className='w-full flex items-center justify-end'><span className={cn('border py-[2px] px-2 rounded-full bg-muted-foreground text-black text-xs font-semibold leading-none', { 'text-white bg-primary': messagesUnreadCount > 0 })}>{messagesUnreadCount}</span></div>
                                    )}
                                </span>
                            </Link>
                        </React.Fragment>
                    )
                );
            })}
        </nav>
    );
}
