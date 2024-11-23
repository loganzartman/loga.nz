import {Variants} from 'framer-motion';

export function ThingCard({variants}: {variants: Variants}) {
  return (
    <motion.div variants={variants}>
      <div className="font-sans text-2xl mb-2">Thing</div>
      <div className="font-serif text-base">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </div>
    </motion.div>
  );
}
