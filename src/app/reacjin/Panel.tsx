'use client';

import {usePanel} from '@/app/reacjin/PanelContext';
import {MotionDiv} from '@/lib/framer-motion';

export function Panel({
  children,
  dragConstraints,
  title,
  buttons,
  icon,
  className,
}: {
  children: React.ReactNode;
  dragConstraints: React.RefObject<HTMLElement>;
  title?: string;
  buttons?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  const {zIndex, activate} = usePanel();

  return (
    <MotionDiv
      drag
      dragConstraints={dragConstraints}
      dragMomentum={false}
      whileDrag={{scale: 1.05}}
      onDragStart={() => {
        activate();
      }}
      style={{zIndex}}
      className={`bg-background/80 backdrop-blur-sm rounded-lg ring-2 ring-brand-400/50 overflow-hidden shadow-black/50 shadow-xl ${className}`}
    >
      <div className="bg-brand-100/10 flex flex-col">
        <div className="flex flex-row items-center p-2 bg-brand-100/10">
          <div className="flex-1 flex flex-row items-center gap-2">
            {icon && <div>{icon}</div>}
            {title}
          </div>
          {buttons}
        </div>
        {children}
      </div>
    </MotionDiv>
  );
}
