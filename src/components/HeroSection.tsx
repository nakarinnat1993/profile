import FadeIn from './FadeIn';
import ContactButton from './ContactButton';
import HeroLogo from './HeroLogo';

const NAV_LINKS = ['About', 'Services', 'Work', 'Contact'];

// Temporary: compare hero layouts with ?hero=center or ?hero=split.
export type HeroVariant = 'classic' | 'center' | 'split';

function ClassicHero() {
  return (
    <>
      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="mt-6 w-full whitespace-nowrap text-center text-[17vw] font-black uppercase leading-none tracking-tight sm:mt-4 md:-mt-5 lg:text-[19vw]">
            <span className="hero-heading hero-heading-bright">ascii</span> <span className="hero-heading-brand">ant</span>
          </h1>
        </FadeIn>
      </div>

      <div className="mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[180px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[260px] md:max-w-[340px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            Software you can trust. Your vision, our expertise.
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="relative z-20">
          <ContactButton label="Contact us" />
        </FadeIn>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 sm:bottom-6 sm:top-auto sm:translate-y-0 md:bottom-8">
        <FadeIn delay={0.6} y={30}>
          <HeroLogo size="classic" />
        </FadeIn>
      </div>
    </>
  );
}

function Nav() {
  return (
    <FadeIn as="nav" delay={0} y={-20} className="relative z-30 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
      {/* Brand navy disappears on black, so a thin light edge outlines it. logo.svg is black, so it's tinted with a mask. */}
      <a
        href="/"
        aria-label="ASCII Ant home"
        style={{ filter: 'drop-shadow(0 0 0.5px #7C9BE0) drop-shadow(0 0 0.5px #7C9BE0)' }}
      >
        <span
          className="block h-8 w-[46px] bg-[#152A55] md:h-10 md:w-[58px]"
          style={{ mask: 'url(/logo.svg) center / contain no-repeat', WebkitMask: 'url(/logo.svg) center / contain no-repeat' }}
        />
      </a>
      <div className="flex gap-6 md:gap-10">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-sm font-medium uppercase tracking-wider text-white transition-opacity duration-200 hover:opacity-70 md:text-base"
          >
            {link}
          </a>
        ))}
      </div>
    </FadeIn>
  );
}

function CenterHero() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
      <FadeIn delay={0.2} y={30}>
        <HeroLogo size="large" />
      </FadeIn>
      <FadeIn delay={0.4} y={30}>
        <h1 className="text-[11vw] font-bold leading-none tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Software You Can <span className="text-[#7C9BE0]">Trust.</span>
        </h1>
      </FadeIn>
      <FadeIn delay={0.55} y={20} className="mt-5 flex flex-col items-center gap-6 md:mt-6">
        <p className="text-base font-light text-[#D7E2EA]/80 md:text-xl">Your vision, our expertise.</p>
        <ContactButton label="Contact us" />
      </FadeIn>
    </div>
  );
}

function SplitHero() {
  return (
    <>
      <div className="flex flex-1 flex-col-reverse items-center justify-center gap-6 px-6 md:px-10 lg:flex-row lg:justify-between lg:gap-10">
        <div className="max-w-2xl text-center lg:text-left">
          <FadeIn delay={0.15} y={20}>
            <p className="mb-4 font-mono text-sm text-[#7C9BE0] md:text-base">{'// ascii ant · software house'}</p>
          </FadeIn>
          <FadeIn delay={0.25} y={30}>
            <h1 className="text-5xl font-bold leading-[1.15] text-white sm:text-6xl xl:text-7xl">
              สร้างซอฟต์แวร์
              <br />
              แบบ<span className="text-[#7C9BE0]">ทีมมด</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.4} y={20}>
            <p className="mt-5 text-lg font-light text-[#D7E2EA]/80 md:text-2xl">
              ทีละบรรทัด อย่างเป็นระบบ · Software You Can Trust.
            </p>
          </FadeIn>
          <FadeIn delay={0.55} y={20} className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
            <ContactButton label="Contact us" />
            <a href="#work" className="text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-base">
              ดูผลงาน →
            </a>
          </FadeIn>
        </div>
        <FadeIn delay={0.3} y={30}>
          <HeroLogo size="medium" />
        </FadeIn>
      </div>

      <FadeIn delay={0.7} y={10} className="flex justify-between px-6 pb-6 font-mono text-xs text-[#D7E2EA]/50 md:px-10 md:pb-8 md:text-sm">
        <span>Web · Mobile · Backend · UX/UI</span>
        <span>scroll ↓</span>
      </FadeIn>
    </>
  );
}

export default function HeroSection({ variant = 'classic' }: { variant?: HeroVariant }) {
  if (variant === 'classic') {
    return (
      <section className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
        <Nav />
        <ClassicHero />
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen flex-col" style={{ overflowX: 'clip' }}>
      <Nav />
      {variant === 'split' ? <SplitHero /> : <CenterHero />}
    </section>
  );
}
