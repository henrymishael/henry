/* eslint-disable prefer-const */

import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Generates the static params for dynamic routes
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Generates the metadata for the dynamic route
export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata | undefined> {
  // Fetch the post based on the slug from params
  let post = await getPost(params.slug);

  // If post is not found, return undefined
  if (!post || !post.metadata) {
    return undefined;
  }

  // Extract metadata from the post
  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;

  // Generate the OpenGraph image URL
  let ogImage = image ? `${DATA.url}${image}` : `${DATA.url}/og?title=${title}`;

  // Return the metadata
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${DATA.url}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// Blog component to display post content
export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  // Fetch the post based on the slug
  let post = await getPost(params.slug);

  // If post is not found, trigger the notFound() function
  if (!post) {
    notFound();
  }

  return (
    <section id='blog'>
      {/* Structured data for the blog post */}
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${DATA.url}${post.metadata.image}`
              : `${DATA.url}/og?title=${post.metadata.title}`,
            url: `${DATA.url}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: DATA.name,
            },
          }),
        }}
      />
      {/* Blog title */}
      <h1 className='title font-medium text-2xl tracking-tighter max-w-[650px]'>
        {post.metadata.title}
      </h1>

      {/* Blog metadata (publish date) */}
      <div className='flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]'>
        <Suspense fallback={<p className='h-5' />}>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            {formatDate(post.metadata.publishedAt)}
          </p>
        </Suspense>
      </div>

      {/* Blog content */}
      <article
        className='prose dark:prose-invert'
        dangerouslySetInnerHTML={{ __html: post.source }}
      />
    </section>
  );
}
