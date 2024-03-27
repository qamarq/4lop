"use client"
import React, { useState, useTransition } from 'react'
import { ChevronRight, Loader2Icon } from "lucide-react"
import styles from "@/styles/Login.module.scss"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSearchParams } from 'next/navigation'
import { FormSuccess } from '@/components/form-success'
import { FormError } from '@/components/form-error'
import { LopLoginForm } from '@/components/login/4lop-login-form'
import { LopRegisterForm } from '@/components/login/4lop-register-form'

export default function LoginPage() {

    return (
        <>
            <div className={styles.container4lop}>
                <h4 className={styles.navigation_label}>Strona główna <ChevronRight size={18} style={{marginInline: 6}} /> Konto użytkownika</h4>
                <div className={styles.title}>
                    <h1>Konto użytkownika</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.login_container}>
                    {/* <div className={styles.alternative_logins}>
                        <div className={styles.social_button}>
                            <Image src={googleIcon} alt="" className={styles.icon} />
                            <p>Google</p>
                        </div>
                        <div className={styles.social_button}>
                            <Image src={fbIcon} alt="" className={styles.icon} />
                            <p>Facebook</p>
                        </div>
                    </div>

                    <div className={styles.divide_div}>
                        <p>Lub</p>
                        <span className={styles.line}></span>
                    </div> */}

                    

                    <Tabs defaultValue="login" className="mt-4 w-[95%] sm:w-[400px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Logowanie</TabsTrigger>
                            <TabsTrigger value="register">Rejestracja</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <div className={"py-5"}>
                                <LopLoginForm />
                            </div>
                        </TabsContent>
                        <TabsContent value="register">
                            <div className={"py-5"}>
                                <LopRegisterForm />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
