import {Variants} from 'framer-motion';

import {ThingCard} from '@/app/(home)/things/ThingCard';

const variants = {
  hide: {
    opacity: 0,
    translateX: '2rem',
  },
  show: {
    opacity: 1,
    translateX: '0',
    transition: {
      staggerChildren: 0.2,
      duration: 1,
    },
  },
} as const satisfies Variants;

export default function Things() {
  return (
    <motion.div
      className="flex flex-col gap-2"
      variants={variants}
      initial="hide"
      animate="hide"
      whileInView="show"
    >
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
      <ThingCard variants={variants} />
    </motion.div>
  );
}
