'use client';

import dynamic from 'next/dynamic';

const LOGO_SIZE =
  'w-[300px] h-[220px] sm:w-[420px] sm:h-[300px] md:w-[520px] md:h-[370px] lg:w-[620px] lg:h-[440px]';

function LogoFallback() {
  return (
    <div className={`flex items-center justify-center ${LOGO_SIZE}`}>
      <img src="/logo.svg" alt="ASCII Ant logo" className="w-[60%] opacity-60 invert" />
    </div>
  );
}

// three.js needs WebGL and `window`, so it only loads in the browser, in its own chunk.
const Logo3D = dynamic(() => import('./Logo3D'), { ssr: false, loading: LogoFallback });

export default function HeroLogo() {
  return <Logo3D className={LOGO_SIZE} />;
}
