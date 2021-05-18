import Head from 'next/head';
interface Tags {
  title: string;
  description: string;
  image?: string; //optional image props
}

export default function MetaTags({ title, description, image }: Tags) {
  return (
    <Head>
      {/* Twitter Metatags */}
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:sites" content="@jacobdiaz" />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Open Graph Metatags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
