import { client } from '@/sanity/lib/client'
import {PortableText} from "@portabletext/react"
import { ChevronRight } from 'lucide-react'
import styles from '@/styles/BlogSlug.module.scss'
import React from 'react'
import Link from 'next/link'

async function getContent(slug: string) {
    const query = `*[ _type == "post" && slug.current == "${slug}" ] {
        title,
        publishedAt,
        _createdAt,
        "author": *[ _id == ^.author._ref ][0].name,
        "slug": slug.current,
        overview,
        body,
        "image": *[ _id == ^.mainImage.asset._ref ][0].url
    }[0]`
    const data = await client.fetch(query)
    // console.log(data)
    return data
}

export default async function SlugPage({
    params
}: {
    params: { slug: string }
}) {
    const data = await getContent(params.slug) as Post
    return (
        <div className={styles.container4lop}>
            {data ? (
                <>
                    <h4 className={styles.navigation_label}>Strona główna <ChevronRight size={18} style={{marginInline: 6}} /> <Link href="/blog">Blog</Link> <ChevronRight size={18} style={{marginInline: 6}} /> {data.title} </h4>
                    <div className={styles.head_image} style={{backgroundImage: `url(${data.image})`}}>
                        <div className={styles.bg_gradient}></div>
                        <div className={styles.title}>
                            <div className={styles.texts}>
                                <h1>{data.title}</h1>
                                <h2>{new Date(data._createdAt).toISOString().split("T")[0]} | {data.author}</h2>
                            </div>
                            <span className={styles.line} />
                        </div>
                    </div>

                    <div className={styles.blog_container}>
                        
                        <PortableText value={data.body} components={{}} />
                    </div>
                </>
            ) : (
                <div>404</div>
            )}
            
        </div>
    )
}