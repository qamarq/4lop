import { getElementContentByElementId } from '@/actions/manage-page-content';
import ConfiguratorPage from '@/components/configurator-content'
import React from 'react'

export default async function KonfiguratorPage() {
    const configuratorBannerImg = await getElementContentByElementId('configuratorBannerImg') || "https://placehold.co/1200x700";

    return (
        <ConfiguratorPage configuratorBannerImg={configuratorBannerImg} />
    )
}
