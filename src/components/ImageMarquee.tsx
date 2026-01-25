import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Maximize2 } from 'lucide-react';

interface ImageMarqueeProps {
  images: { src: string; label: string }[];
  onImageClick?: (index: number) => void;
  speed?: number;
  pauseOnHover?: boolean;
}

const ImageMarquee = ({ 
  images, 
  onImageClick, 
  speed = 30,
  pauseOnHover = true 
}: ImageMarqueeProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollOffset = useMotionValue(0);
  const springOffset = useSpring(scrollOffset, { stiffness: 100, damping: 30 });

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images, ...images];

  // Calculate animation duration based on number of images
  const duration = images.length * speed;

  useEffect(() => {
    if (!containerRef.current || isPaused || isDragging) return;

    let animationFrame: number;
    let startTime: number | null = null;
    const totalWidth = containerRef.current.scrollWidth / 3;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed / (duration * 1000)) % 1;
      scrollOffset.set(-progress * totalWidth);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, isDragging, duration, scrollOffset]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - dragStartX.current;
    scrollOffset.set(scrollOffset.get() + delta);
    dragStartX.current = clientX;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="relative overflow-hidden w-full"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); setIsDragging(false); }}
    >
      {/* Glass overlay hint */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-r from-background via-transparent to-background" />
      
      <motion.div
        ref={containerRef}
        className="flex gap-4 cursor-grab active:cursor-grabbing py-2"
        style={{ x: springOffset }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {duplicatedImages.map((image, index) => {
          const originalIndex = index % images.length;
          const isHovered = hoveredIndex === index;
          
          return (
            <motion.div
              key={`${image.src}-${index}`}
              className="relative flex-shrink-0 rounded-lg overflow-hidden group"
              style={{ width: 280, height: 180 }}
              animate={{
                scale: isHovered ? 1.08 : 1,
                zIndex: isHovered ? 10 : 1,
              }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => !isDragging && onImageClick?.(originalIndex)}
            >
              {/* Glass morphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
              
              <img
                src={image.src}
                alt={image.label}
                className="w-full h-full object-cover transition-transform duration-500"
                loading="lazy"
                draggable={false}
              />

              {/* Data flow pulse animation overlay - Multi-layer effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Primary horizontal pulse */}
                <motion.div
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent blur-[1px]"
                  style={{ top: '30%' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.2,
                  }}
                />
                {/* Secondary pulse - offset timing */}
                <motion.div
                  className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-secondary/50 to-transparent blur-[0.5px]"
                  style={{ top: '60%' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.3 + 0.5,
                  }}
                />
                {/* Glowing particle effect */}
                <motion.div
                  className="absolute w-3 h-3 rounded-full bg-primary/80 shadow-[0_0_10px_2px_hsl(var(--primary)/0.6)]"
                  style={{ top: '45%' }}
                  animate={{ 
                    x: ['-20px', '300px'],
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1, 1, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.4,
                  }}
                />
                {/* "Syncing" indicator on hover */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded bg-primary/90 backdrop-blur-sm"
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-primary-foreground"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                    <span className="text-[10px] font-mono text-primary-foreground">SYNCING...</span>
                  </motion.div>
                )}
              </div>

              {/* Label & expand hint */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-3 z-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 5 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground bg-background/60 backdrop-blur-sm px-2 py-1 rounded">
                    {image.label}
                  </span>
                  <motion.div
                    className="p-1.5 rounded bg-primary/80 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                  >
                    <Maximize2 className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Terminal log hint */}
      <motion.div
        className="absolute bottom-0 left-4 text-xs font-mono text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPaused ? 1 : 0 }}
      >
        &gt; interactive_canvas_paused...
      </motion.div>
    </div>
  );
};

export default ImageMarquee;
