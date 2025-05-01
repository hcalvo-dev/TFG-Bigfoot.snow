import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

import StickyHero from './StickyHero';
import DesktopContent from './DesktopContent';
import MobileContent from './MobileContent';

export default function StickyImageEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const marqueeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const dividerOpacity = useTransform(scrollYProgress, [0.32, 0.35], [0.6, 1]);
  const logosOpacity = useTransform(scrollYProgress, [0.26, 0.4], [0, 1]);
  const iconsOpacity = useTransform(scrollYProgress, [0.36, 0.42], [0, 1]);
  const rombosOpacity = useTransform(scrollYProgress, [0.40, 0.49], [0, 1]);
  const firstMobileBlockOpacity = useTransform(scrollYProgress, [0.30, 0.4], [1, 0]);
  const firstMobileBlockY = useTransform(scrollYProgress, [0.30, 0.4], [0, -100]);
  const secondMobileBlockOpacity = useTransform(scrollYProgress, [0.4, 0.59], [0, 1]);
  const secondMobileBlockY = useTransform(scrollYProgress, [0.4, 0.59], [100, 0]);

  return (
    <section ref={containerRef} className="relative w-full min-h-[500vh]">
      <StickyHero imageOpacity={imageOpacity} textOpacity={textOpacity} marqueeOpacity={marqueeOpacity} />
      <DesktopContent dividerOpacity={dividerOpacity} logosOpacity={logosOpacity} iconsOpacity={iconsOpacity} rombosOpacity={rombosOpacity} />
      <MobileContent
        firstOpacity={firstMobileBlockOpacity}
        firstY={firstMobileBlockY}
        secondOpacity={secondMobileBlockOpacity}
        secondY={secondMobileBlockY}
      />
    </section>
  );
}
