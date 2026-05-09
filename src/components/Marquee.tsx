import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MarqueeProps {
  items: ReactNode[];
  speed?: number; // seconds per loop
  className?: string;
  itemClassName?: string;
  separator?: ReactNode;
  pauseOnHover?: boolean;
}

const Marquee = ({
  items,
  speed = 30,
  className = '',
  itemClassName = '',
  separator,
  pauseOnHover = true,
}: MarqueeProps) => {
  // Duplicate items to create seamless loop
  const loop = [...items, ...items];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex w-max items-center gap-8"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
      >
        {loop.map((item, i) => (
          <div key={i} className={`flex shrink-0 items-center gap-8 ${itemClassName}`}>
            <span>{item}</span>
            {separator}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
