import { motion } from 'framer-motion';

/**
 * Premium animated mesh-gradient background with a subtle "digital constellation"
 * of low-opacity tech glyphs floating behind the content.
 */
const techGlyphs = [
  // Code brackets
  { type: 'text' as const, value: '</>', size: 22 },
  { type: 'text' as const, value: '{ }', size: 20 },
  { type: 'text' as const, value: '=>', size: 20 },
  { type: 'text' as const, value: 'AI', size: 18 },
  { type: 'text' as const, value: 'n8n', size: 18 },
  { type: 'text' as const, value: '◆', size: 22 },
  { type: 'text' as const, value: '◇', size: 22 },
  { type: 'text' as const, value: '⬡', size: 22 },
  { type: 'text' as const, value: '⌘', size: 20 },
  { type: 'text' as const, value: '∴', size: 22 },
  { type: 'text' as const, value: '·{ }·', size: 16 },
  { type: 'text' as const, value: 'fn()', size: 16 },
];

// Deterministic positions so glyphs feel like a designed constellation
const constellation = [
  { left: '6%',  top: '12%', delay: 0,   dur: 9 },
  { left: '18%', top: '38%', delay: 1.2, dur: 11 },
  { left: '12%', top: '72%', delay: 0.6, dur: 10 },
  { left: '28%', top: '88%', delay: 2.0, dur: 12 },
  { left: '42%', top: '22%', delay: 0.4, dur: 10 },
  { left: '55%', top: '64%', delay: 1.8, dur: 11 },
  { left: '68%', top: '14%', delay: 1.0, dur: 9 },
  { left: '78%', top: '40%', delay: 2.2, dur: 12 },
  { left: '86%', top: '70%', delay: 0.8, dur: 10 },
  { left: '92%', top: '20%', delay: 1.6, dur: 11 },
  { left: '34%', top: '52%', delay: 2.4, dur: 12 },
  { left: '62%', top: '86%', delay: 0.2, dur: 10 },
];

const MeshGradientBackground = () => {
  return (
    <div className="fixed inset-0 -z-0 pointer-events-none overflow-hidden">
      {/* Base midnight wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Subtle high-tech grid mesh */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(0 0% 100% / 0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at 50% 30%, black 0%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 30%, black 0%, transparent 78%)',
        }}
      />

      {/* Drifting mesh gradient blobs — accent glow spots */}
      <motion.div
        className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full blur-[140px] opacity-40"
        style={{ background: 'radial-gradient(circle, hsl(244 90% 65% / 0.55), transparent 70%)' }}
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 w-[620px] h-[620px] rounded-full blur-[140px] opacity-35"
        style={{ background: 'radial-gradient(circle, hsl(190 95% 55% / 0.45), transparent 70%)' }}
        animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-[560px] h-[560px] rounded-full blur-[140px] opacity-30"
        style={{ background: 'radial-gradient(circle, hsl(160 84% 45% / 0.4), transparent 70%)' }}
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-2/3 left-[10%] w-[420px] h-[420px] rounded-full blur-[140px] opacity-25"
        style={{ background: 'radial-gradient(circle, hsl(280 80% 60% / 0.4), transparent 70%)' }}
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Digital constellation — subtle floating tech glyphs */}
      <div className="absolute inset-0">
        {constellation.map((pos, i) => {
          const glyph = techGlyphs[i % techGlyphs.length];
          return (
            <motion.span
              key={i}
              className="absolute font-mono select-none"
              style={{
                left: pos.left,
                top: pos.top,
                fontSize: glyph.size,
                color: 'hsl(0 0% 100%)',
                opacity: 0.06,
                textShadow: '0 0 12px hsl(244 90% 66% / 0.35)',
              }}
              animate={{
                y: [0, -14, 0],
                opacity: [0.05, 0.11, 0.05],
              }}
              transition={{
                duration: pos.dur,
                delay: pos.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {glyph.value}
            </motion.span>
          );
        })}
      </div>

      {/* Top vignette for header legibility */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{ background: 'linear-gradient(to bottom, hsl(240 10% 4% / 0.85), transparent)' }}
      />
      {/* Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{ background: 'linear-gradient(to top, hsl(240 10% 4% / 0.9), transparent)' }}
      />

      {/* Subtle film grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
};

export default MeshGradientBackground;
