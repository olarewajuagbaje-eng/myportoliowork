import { motion } from 'framer-motion';

/**
 * Premium animated mesh-gradient background.
 * Replaces the scattered floating node icons with a single, sophisticated
 * high-tech ambient effect: soft drifting color blobs over a fine grid mesh.
 */
const MeshGradientBackground = () => {
  return (
    <div className="fixed inset-0 -z-0 pointer-events-none overflow-hidden">
      {/* Base midnight wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Subtle high-tech grid mesh */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(0 0% 100% / 0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at 50% 30%, black 0%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 30%, black 0%, transparent 75%)',
        }}
      />

      {/* Drifting mesh gradient blobs */}
      <motion.div
        className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full blur-[140px] opacity-40"
        style={{ background: 'radial-gradient(circle, hsl(240 90% 65% / 0.55), transparent 70%)' }}
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
