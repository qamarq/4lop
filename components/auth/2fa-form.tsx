"use client"

import { useState } from "react";
import { CardWrapper } from "./card-wrapper"
import { GeneratedSecret } from "speakeasy";
import { Button } from "../ui/button";
import { FingerprintIcon, Loader2Icon, QrCodeIcon } from "lucide-react";
import { useTransition } from "react";
import qrcode from 'qrcode';
import { generateTwoFactor, saveTwoFactor } from "@/actions/manage-2fa";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import Image from "next/image";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export const TwoFactorForm = ({ callback }: { callback: (success: boolean) => void }) => {
    const [twoFactorTmp, setTwoFactorTmp] = useState<GeneratedSecret | null>(null);
    const [qrCode, setQrCode] = useState('');
    const [tmpCode, setTmpCode] = useState('');
    const [step, setStep] = useState(1);
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string | undefined>("")
    const [error, setError] = useState<string | undefined>("")
    const [end, setEnd] = useState(false)

    const onClickStepOne = async () => {
        setError("")
        setSuccess("")

        startTransition(async () => {
            await generateTwoFactor()
                .then(async (data) => {
                    if (data.success && data.success !== undefined) {
                        const otpData = data.success as GeneratedSecret
                        setTwoFactorTmp(otpData)
                        const base64 = await qrcode.toDataURL(otpData.otpauth_url || "");
                        setQrCode(base64)
                        setSuccess("Wygenerowano kod QR pomyślnie")
                        setStep(2)
                    }
                })
                .catch((err) => {
                    setError("Something went wrong, please try again later")
                })
        })
    }

    const onClickStepTwo = async () => {
        setError("")
        setSuccess("")

        startTransition(async () => {
            await saveTwoFactor(tmpCode, twoFactorTmp?.base32 || '')
                .then((data) => {
                    if (data.success && data.success !== undefined) {
                        setSuccess("Uwieżytelnianie dwuetapowe zostało włączone pomyślnie")
                        setEnd(true)
                        setTimeout(() => {
                            //reseting form
                            setSuccess("")
                            setEnd(false)
                            setError("")
                            setStep(1)
                            setTmpCode("")
                            setTwoFactorTmp(null)
                            setQrCode("")

                            callback(true)
                        }, 2000)
                    } else if (data.error && data.error !== undefined) {
                        setError(data.error as string)
                    }
                })
                .catch((err) => {
                    setError("Something went wrong, please try again later")
                })
        })
    }
    
    return (
        <CardWrapper
            headerLabel='Włącz uwierzytelnianie dwuetapowe (2FA) dla swojego konta'
            backButtonLabel={null}
            backButtonHref={null}
        >
            <div className="p-1">
                <div className="mb-4">
                    <FormSuccess message={success} />
                    <FormError message={error} />
                </div>
                {step === 1 && (
                    <Button disabled={isPending} className="w-full" onClick={onClickStepOne}>
                        {isPending ? (
                            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <QrCodeIcon className="h-4 w-4 mr-2" />
                        )}
                        Wygeneruj kod QR
                    </Button>   
                )}
                {step === 2 && (
                    <div className="flex flex-col items-center justify-center">
                        {qrCode && (
                            <div className="w-[220px] h-[220px] flex items-center justify-center border rounded-md">
                                <Image width={200} height={200} className="qrcode" src={qrCode} alt="" />
                            </div>
                        )}
                        <div className='mt-6 flex flex-col items-center gap-2'>
                            {/* <Input disabled={end || isPending} value={tmpCode} onChange={(e) => setTmpCode(e.target.value)} className="w-full" type="number" placeholder="123456" /> */}
                            <InputOTP maxLength={6} value={tmpCode} disabled={end || isPending} onChange={(value) => setTmpCode(value)} className="w-full" onComplete={onClickStepTwo} inputMode={"numeric"}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <Button disabled={end || isPending} className="w-full" onClick={onClickStepTwo}>
                                {isPending ? (
                                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <FingerprintIcon className="h-4 w-4 mr-2" />
                                )}
                                Zatwierdź kod
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </CardWrapper>
    )
}