import {ThingCard} from '@/app/(home)/things/ThingCard';
import {MotionDiv, Variants} from '@/lib/motion-react';

const variants = {
  hide: {
    opacity: 0,
    translateX: '2rem',
  },
  show: {
    opacity: 1,
    translateX: '0',
    transition: {
      duration: 1,
    },
  },
} as const satisfies Variants;

export default function Things() {
  return (
    <MotionDiv
      className="flex flex-col gap-2"
      variants={variants}
      initial="hide"
      whileInView="show"
      viewport={{once: false, amount: 0.5}}
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
    </MotionDiv>
  );
}
