import React from 'react'
import styles from '@/styles/Home.module.scss';
import { HomeProductSekelet } from '../HomeProduct';

export default function Skelete() {
    return (
        <div className={styles.shop_products}>
            <HomeProductSekelet />
            <HomeProductSekelet />
            <HomeProductSekelet />
        </div>
    )
}
