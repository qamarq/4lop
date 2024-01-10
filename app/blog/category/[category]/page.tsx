/* eslint-disable @next/next/no-img-element */
import { client } from "@/sanity/lib/client"
import styles from '@/styles/Blog.module.scss'
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

async function getContent(category_id: string) {
    const queryCategory = `*[ _type == "category" && slug.current == "${category_id}" ] { _id, title }[0]`
    const dataCategory = await client.fetch(queryCategory)

    const queryPosts = `
    *[ _type == "post" && references("${dataCategory._id}") ] {
        title,
        publishedAt,
        _createdAt,
        "categories": categories[]->title,
        "author": author->name,
        "slug": slug.current,
        overview,
        "image": mainImage.asset->url
    }`
    const dataPosts = await client.fetch(queryPosts)
    return {
        category: dataCategory,
        posts: dataPosts
    }
}

export default async function CategoryPage({
    params
}: {
    params: { category: string }
}) {
    const data = await getContent(params.category) as { category: { title: string }, posts: Post[] }
    return (
        <div className={styles.container}>
            <h4 className={styles.navigation_label}>
                Strona główna 
                <ChevronRight size={18} style={{marginInline: 6}} /> 
                <Link href="/blog">Blog</Link>
                <ChevronRight size={18} style={{marginInline: 6}} />
                {data.category.title}
            </h4>
            <div className={styles.title}>
                <Link href="/blog" className={styles.icon_back}>
                    <ChevronLeft size={30} />
                </Link>
                <h1>{data.category.title}</h1>
                <span className={styles.line} />
            </div>

            <section className={styles.blog}>
                <div className={styles.posts}>
                    {data.posts && data.posts.length > 0 ? data.posts.map((post) => (
                        <Link href={"/blog/article/"+post.slug} key={post._id} className={styles.post}>
                            <Image src={post.image} alt="" draggable={false} width={500} height={500} />

                            <div className={styles.texts}>
                                <h1>{post.title}</h1>
                                <p>{post.overview}</p>
                            </div>

                            <div className={styles.bottom}>
                                <p>Przeczytaj post</p>
                                <div className={styles.icon}>
                                    <ChevronRight size={25} />
                                </div>
                            </div>
                        </Link>
                    )) : (
                        <div>Brak postów</div>
                    )}
                </div>
            </section>
        </div>
    )
}