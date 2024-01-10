"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { BackButton } from "./back-button"
import { Header } from "./header"
import { Social } from "./social"

interface CardWrapperProps {
    children: React.ReactNode,
    headerLabel: string,
    backButtonLabel: string | null,
    backButtonHref: string | null,
    showSocial?: boolean,
}

export const CardWrapper = ({ children, headerLabel, backButtonHref, backButtonLabel, showSocial }: CardWrapperProps) => {
    return (
        <Card className="w-full max-w-[400px] shadow-md">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>   
            )}
            {backButtonLabel && backButtonHref && (
                <CardFooter>
                    <BackButton
                        label={backButtonLabel}
                        href={backButtonHref}
                    />
                </CardFooter>
            )}
        </Card>
    )
}