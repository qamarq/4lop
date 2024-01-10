import styles from "@/styles/Account.module.scss"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.content}>
            {children}
        </div>
    )
}