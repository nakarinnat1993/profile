'use client';

import dynamic from 'next/dynamic';

const LOGO_SIZES = {
  classic: 'w-[300px] h-[220px] sm:w-[420px] sm:h-[300px] md:w-[520px] md:h-[370px] lg:w-[620px] lg:h-[440px]',
  large: 'w-[320px] h-[230px] sm:w-[480px] sm:h-[340px] md:w-[620px] md:h-[420px] lg:w-[720px] lg:h-[480px]',
  medium: 'w-[300px] h-[220px] sm:w-[420px] sm:h-[300px] lg:w-[520px] lg:h-[400px] xl:w-[620px] xl:h-[460px]',
};

function LogoFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img src="/logo.svg" alt="ASCII Ant logo" className="w-[60%] opacity-60 invert" />
    </div>
  );
}

// three.js needs WebGL and `window`, so it only loads in the browser, in its own chunk.
const Logo3D = dynamic(() => import('./Logo3D'), { ssr: false, loading: LogoFallback });

export default function HeroLogo({ size }: { size: keyof typeof LOGO_SIZES }) {
  return (
    <div className={LOGO_SIZES[size]}>
      <Logo3D className="h-full w-full" />
    </div>
  );
}
