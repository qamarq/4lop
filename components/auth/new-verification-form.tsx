"use client"

import { BeatLoader } from "react-spinners"
import { CardWrapper } from "./card-wrapper"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { verifyEmail } from "@/actions/new-verification"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [loading, setLoading] = useState<boolean>(true)

    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const onSubmit = useCallback(() => {
        if (success || error) return
        if (!token) {
            setError("Missing token")
            setLoading(false)
            return
        }
        verifyEmail(token)
            .then(data => {
                setSuccess(data?.success)
                setError(data?.error)
            })
            .catch(() => {
                setError("Something went wrong. Please try again.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [error, success, token])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    if (!token) {
        return (
            <CardWrapper
                headerLabel="Invalid verification link"
                backButtonHref="/auth/login"
                backButtonLabel="Back to login"
            >
                <p className="text-gray-500 text-sm">
                    The verification link you have used is invalid. Please try again.
                </p>
            </CardWrapper>
        )
    }

    return (
        <CardWrapper
            headerLabel="Confirming your email address in progress..."
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <div className="flex items-center w-full justify-center">
                {loading ? (
                    <BeatLoader  />
                ) : (
                    <>
                        <FormSuccess message={success} />
                        {!success && (
                            <FormError message={error} />
                        )}
                    </>
                )}
            </div>
        </CardWrapper>
    )
}