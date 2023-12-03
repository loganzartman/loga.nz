'use client';

import {AnimatePresence, motion} from 'framer-motion';

import {hash} from '@/app/blog/posts/consistent-hashing/hash-string';

type Props = {
  servers: string[];
  keys: string[];
  circle: boolean;
  seed: number;
};

function pointsToD(points: number[][]) {
  console.log(points);
  return points
    .map(
      (p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(3)},${p[1].toFixed(3)}`,
    )
    .join(' ');
}

export default function Ring({servers, keys, circle, seed}: Props) {
  const n = 64;
  const mod = 2 ** 32 - 1;

  const variants = {
    line: {
      d: pointsToD(Array.from({length: n}).map((_, i) => [(i / n) * 2 - 1, 0])),
    },
    circle: {
      d: pointsToD(
        Array.from({length: n}).map((_, i) => {
          const f = (i / (n - 1) + 0.25) * 2 * Math.PI;
          return [Math.cos(f), Math.sin(f)];
        }),
      ),
    },
  };

  const serverIcons = servers.map((server, i) => {
    const h = hash(server, seed);
    const pos = h / mod;
    const circleProps = {
      translateX: Math.cos((pos + 0.25) * Math.PI * 2),
      translateY: Math.sin((pos + 0.25) * Math.PI * 2),
      scale: 1,
      opacity: 1,
      fill: `hsl(${(i / servers.length) * 0.9 * 360}, 80%, 80%)`,
    };
    const lineProps = {
      translateX: pos * 2 - 1,
      translateY: 0,
      scale: 1,
      opacity: 1,
      fill: `hsl(${(i / servers.length) * 0.9 * 360}, 80%, 80%)`,
    };

    return (
      <motion.g
        key={server}
        custom={i}
        initial={{opacity: 0, scale: 0, translateX: 0, translateY: 0}}
        exit={{opacity: 0, scale: 0, translateX: 0, translateY: 0}}
        animate={circle ? circleProps : lineProps}
        transition={{type: 'spring', stiffness: 200, damping: 40}}
      >
        <circle cx={0} cy={0} r={0.05} />
        <text
          fill="black"
          fontSize="0.06"
          alignmentBaseline="middle"
          textAnchor="middle"
          fontWeight="bold"
          x={0}
          y={0}
        >
          {server}
        </text>
      </motion.g>
    );
  });

  return (
    <motion.svg
      className="w-full"
      viewBox="-1.2 -1.2 2.4 2.4"
      animate={circle ? 'circle' : 'line'}
    >
      <motion.path
        variants={variants}
        className="stroke-brand-200"
        strokeWidth="2"
        fill="none"
        transition={{type: 'spring', stiffness: 200, damping: 40}}
      />
      <AnimatePresence>{serverIcons}</AnimatePresence>
    </motion.svg>
  );
}
