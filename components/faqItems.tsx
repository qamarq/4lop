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

export const FAQContainer = () => {
    return (
        <motion.div layout className={styles.faq_container}>
            <LayoutGroup>
                <motion.ul layout initial={{ borderRadius: 25 }}>
                    <FAQItem title={"Jaki jest <span>koszt wysyłki</span> zakupionego stołu?"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vulputate eget tellus nec interdum. Sed a justo eu neque lobortis sollicitudin. Curabitur ultrices elit justo, id pulvinar massa blandit condimentum. Donec congue nibh id tristique commodo. Ut lacinia vestibulum augue. Aliquam venenatis sapien nec hendrerit pretium. Pellentesque faucibus faucibus malesuada."} />
                    <FAQItem title={"Czy mogę <span>zwrócić / reklamować</span> zakupione stoły?"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vulputate eget tellus nec interdum. Sed a justo eu neque lobortis sollicitudin. Curabitur ultrices elit justo, id pulvinar massa blandit condimentum. Donec congue nibh id tristique commodo. Ut lacinia vestibulum augue. Aliquam venenatis sapien nec hendrerit pretium. Pellentesque faucibus faucibus malesuada."} />
                    <FAQItem title={"Czy mogę dokonać rezerwacji stołu?"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vulputate eget tellus nec interdum. Sed a justo eu neque lobortis sollicitudin. Curabitur ultrices elit justo, id pulvinar massa blandit condimentum. Donec congue nibh id tristique commodo. Ut lacinia vestibulum augue. Aliquam venenatis sapien nec hendrerit pretium. Pellentesque faucibus faucibus malesuada."} />
                    <FAQItem title={"Czy wszystkie stoły dostępne na stronie są również w sklepie?"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vulputate eget tellus nec interdum. Sed a justo eu neque lobortis sollicitudin. Curabitur ultrices elit justo, id pulvinar massa blandit condimentum. Donec congue nibh id tristique commodo. Ut lacinia vestibulum augue. Aliquam venenatis sapien nec hendrerit pretium. Pellentesque faucibus faucibus malesuada."} />
                    <FAQItem title={"Jakie są godziny otwarcia sklepu w Toruniu?"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vulputate eget tellus nec interdum. Sed a justo eu neque lobortis sollicitudin. Curabitur ultrices elit justo, id pulvinar massa blandit condimentum. Donec congue nibh id tristique commodo. Ut lacinia vestibulum augue. Aliquam venenatis sapien nec hendrerit pretium. Pellentesque faucibus faucibus malesuada."} />
                    <FAQItem title={"Jaki jest czas oczekiwania dostawy do mojego domu?"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vulputate eget tellus nec interdum. Sed a justo eu neque lobortis sollicitudin. Curabitur ultrices elit justo, id pulvinar massa blandit condimentum. Donec congue nibh id tristique commodo. Ut lacinia vestibulum augue. Aliquam venenatis sapien nec hendrerit pretium. Pellentesque faucibus faucibus malesuada."} />
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