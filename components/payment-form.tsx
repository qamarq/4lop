"use client"

import { useCurrentUser } from "@/hooks/use-current-user";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Link from "next/link";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, WalletCardsIcon } from "lucide-react";

export const PaymentForm = () => {
    const searchParams = useSearchParams()
    const stripe = useStripe();
    const elements = useElements();
    const orderId = searchParams.get('orderId')
    const paymentId = searchParams.get('paymentId')
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const user = useCurrentUser()

    useEffect(() => {
        if (!stripe) {
            return;
        }
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: window.location.origin+"/koszyk/platnosc/podsumowanie",
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message as string);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form className="w-full mt-4 rounded-lg border p-[5rem] shadow-sm bg-gray-100" onSubmit={handleSubmit}>

            <PaymentElement 
                options = {
                    {
                        defaultValues: {
                            billingDetails: {
                                name: user?.name || "",
                                email: user?.email || "",
                                phone: user?.phone || "",
                            }
                        },
                        layout: {
                            type: 'tabs',
                            defaultCollapsed: false,
                            radios: false,
                            spacedAccordionItems: true
                        },
                    }
                }
            />
            <div className="flex items-center justify-end gap-4 mt-4">
                <Button variant={"outline"}>
                    Anuluj płatność
                </Button>
                <Button disabled={isLoading || !stripe || !elements}>
                    {isLoading ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <WalletCardsIcon className="w-4 h-4 mr-2" />}
                    Zapłać teraz
                </Button>
            </div>
            {message && <div id="payment-message">{message}</div>}
        </form>
    )
}