import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, canonical }) => {
  const siteName = 'SeePlanAct';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Robots that see, plan, and act`;
  const desc = description || 'Learn robotics, computer vision, and intelligent path planning with SeePlanAct.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
};

export default SEO;
