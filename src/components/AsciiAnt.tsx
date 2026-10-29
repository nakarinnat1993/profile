'use client';

import { useEffect, useRef, useState } from 'react';

type Gaze = 'left' | 'center' | 'right';

// The head line is built at render time so the eyes can blink and follow the cursor.
const HEAD = '{HEAD}';

// Two walking poses: antennae wiggle and the legs alternate between them.
const FRAMES = [
  [
    '    \\             /    ',
    '     \\           /     ',
    '      \\ .-----. /      ',
    HEAD,
    '        `-._.-\'        ',
    '   \\__  .-----.  __/   ',
    '      \\/       \\/      ',
    '  ----|         |----  ',
    '      /\\       /\\      ',
    '   __/  `-----\'  \\__   ',
    '          | |          ',
    '       .-\'   \'-.       ',
    '      /         \\      ',
    '     |           |     ',
    '     |           |     ',
    '      \\         /      ',
    '       \'-.___.-\'       ',
  ],
  [
    '     |           |     ',
    '      \\         /      ',
    '       \\.-----./       ',
    HEAD,
    '        `-._.-\'        ',
    '  \\     .-----.     /  ',
    '   \\___/       \\___/   ',
    '   ---|         |---   ',
    '      /\\       /\\      ',
    '     /  `-----\'  \\     ',
    '    /     | |     \\    ',
    '       .-\'   \'-.       ',
    '      /         \\      ',
    '     |           |     ',
    '     |           |     ',
    '      \\         /      ',
    '       \'-.___.-\'       ',
  ],
];

const EYES: Record<Gaze, string> = {
  left: '(o   o  )',
  center: '( o   o )',
  right: '(  o   o)',
};

function headLine(gaze: Gaze, blinking: boolean) {
  const eyes = blinking ? EYES[gaze].replace(/o/g, '-') : EYES[gaze];
  return `       ${eyes}       `;
}

export default function AsciiAnt({ className }: { className?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [frame, setFrame] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const [gaze, setGaze] = useState<Gaze>('center');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const walk = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 260);
    const blink = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 160);
    }, 3200);

    return () => {
      clearInterval(walk);
      clearInterval(blink);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const { left, width } = el.getBoundingClientRect();
      const dx = e.clientX - (left + width / 2);
      setGaze(dx < -width / 4 ? 'left' : dx > width / 4 ? 'right' : 'center');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const art = FRAMES[frame].map((line) => (line === HEAD ? headLine(gaze, blinking) : line)).join('\n');

  return (
    <pre
      ref={ref}
      role="img"
      aria-label="ASCII Ant mascot"
      className={`select-none font-mono font-bold leading-[1.1] text-[#F59E0B] ${className ?? ''}`}
      style={{ textShadow: '0 0 18px rgba(245, 158, 11, 0.45)' }}
    >
      {art}
    </pre>
  );
}
