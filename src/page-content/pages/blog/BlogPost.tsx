"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { getBlogItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import BlogPostSection from "@/page-content/components/section/blog/BlogPostSection";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";

export default function BlogPostPage({ slug }: { slug: string }) {
  const { lang } = useLanguage();

  const blogId = parseInt(slug, 10);
  const blog = getBlogItems(lang).find((item) => item.id === blogId);

  if (isNaN(blogId) || !blog) {
    return null;
  }

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={blog.title} />

      <Section id="blog-post">
        <BlogPostSection id={blogId} />
      </Section>
    </PageLayout>
  );
}
