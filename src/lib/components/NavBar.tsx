'use client';

import {useScroll, Variants} from 'framer-motion';
import {useEffect, useMemo, useState} from 'react';

import NavItem from '@/lib/components/NavItem';
import {MotionDiv} from '@/lib/framer-motion';

export default function NavBar() {
  const [state, setState] = useState<'stuck' | 'floating'>('floating');
  const containerVariants = useMemo<Variants>(
    () =>
      ({
        floating: {
          transform: 'translateY(32px)',
        },
        stuck: {transform: 'translateY(-2px)'},
      }) as const,
    [],
  );
  const barVariants = useMemo<Variants>(
    () =>
      ({
        floating: {
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        },
        stuck: {
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
          borderTopWidth: '0',
        },
      }) as const,
    [],
  );
  const {scrollY} = useScroll();

  useEffect(() => {
    return scrollY.on('change', (value) => {
      if (value > 120) setState('stuck');
      else setState('floating');
    });
  }, [scrollY]);

  return (
    <MotionDiv
      variants={containerVariants}
      initial="floating"
      animate={state}
      transition={{transform: {type: 'spring', bounce: 0.6}}}
      className="z-10 fixed top-0 left-0 right-0 flex flex-row justify-center"
    >
      <MotionDiv
        variants={barVariants}
        style={{borderRadius: '20px'}}
        className="flex flex-row items-center h-[40px] gap-4 px-5 ring-1 ring-brand-100/80 bg-background/50 backdrop-blur-sm backdrop-saturate-200 shadow-big-glow shadow-brand-100/70"
      >
        <NavItem label="about" href="/" />
        <NavItem label="blog" href="/blog" />
        <NavItem label="things" href="/things" />
      </MotionDiv>
    </MotionDiv>
  );
}
