"use client"

import { useState } from 'react';
import styles from '../styles/Home.module.scss';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ChevronRight, Plus } from 'lucide-react';
import { v4 } from 'uuid';

export const QuickFAQItem = ({ title, opened, items } : { title: string, opened?: boolean, items: string[] }) => {
    const [show, setShow] = useState(false || opened);
    return (
        <div className={styles.faq_item}>
            <div className={styles.click} onClick={() => setShow(prev => !prev)}>
                <ChevronRight size={24} className={`${styles.arror_icon} ${show ? styles.rotate : ''}`} />
                <h1>{title}</h1>
            </div>

            <AnimatePresence>
                {show && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className={styles.faq_content}>
                        {items.map((item) => (
                            <div className={styles.item} key={v4()}>
                                <Plus size={12} className={styles.icon} />
                                <p dangerouslySetInnerHTML={{ __html: item }}></p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export const FAQItem = ({ title, content } : { title: string, content: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);
    return (
        <motion.li layoutId={title} layout initial={{ borderRadius: 10 }} className={styles.faq_item}>
            <motion.div className={styles.click} onClick={toggleOpen} layout>
                <ChevronRight size={24} className={`${styles.arror_icon} ${isOpen ? styles.rotate : ''}`} />
                <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div layout initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className={styles.faq_content}>
                        <p dangerouslySetInnerHTML={{ __html: content }}></p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.li>
    )
}

export const FAQContainer = ({ faqContent }: { faqContent: {id: string, title: string, content: string}[] }) => {
    return (
        <motion.div layout className={styles.faq_container}>
            <LayoutGroup>
                <motion.ul layout initial={{ borderRadius: 25 }}>
                    {faqContent.map((item) => (
                        <FAQItem key={item.id} title={item.title} content={item.content} />
                    ))}
                </motion.ul>
            </LayoutGroup>
            
        </motion.div>
    )
}

export const QuickFAQ = () => {
    return (
        <LayoutGroup>
            <motion.div className={styles.quick_faq}>
                <QuickFAQItem 
                    title={"Stół Standard"} 
                    opened={true} 
                    items={
                        [
                            "<span>Płyta meblowa</span>, która łatwo wymienia się po zużyciu",
                            "<span>Nadstawka</span> z 2 slupków",
                            "<span>Górna półka</span> na kartony"
                        ]
                    }
                />
                <QuickFAQItem 
                    title={"Stół Rozszerzony"}
                    items={
                        [
                            "<span>Płyta meblowa</span>, która łatwo wymienia się po zużyciu2",
                            "<span>Nadstawka</span> z 2 slupków",
                            "<span>Górna półka</span> na kartony"
                        ]
                    }
                />
                <QuickFAQItem 
                    title={"Stół Pakowy"} 
                    items={
                        [
                            "<span>Płyta meblowa</span>, która łatwo wymienia się po zużyciu3",
                            "<span>Nadstawka</span> z 2 slupków",
                            "<span>Górna półka</span> na kartony"
                        ]
                    }
                />
            </motion.div>
        </LayoutGroup>
    )
}