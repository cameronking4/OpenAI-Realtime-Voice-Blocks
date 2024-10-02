import { docs } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";

interface DocsPageProps {
  params: { slug: string[] };
}

async function getDocsFromParams(params: DocsPageProps["params"]) {
  const slug = params?.slug as unknown as string;
  const doc = docs.find((doc) => doc.slugAsParams.includes(slug));

  return doc;
}

export default async function DocsPage({ params }: DocsPageProps) {
  const doc = await getDocsFromParams(params);

  if (!doc || !doc.published) {
    return notFound();
  }

  return (
    <article className="prose dark:prose-invert justify-start items-start py-10 min-w-0 max-w-full mdx">
      <MDXContent code={doc.body} />
    </article>
  );
}
