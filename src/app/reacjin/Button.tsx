import * as React from 'react';

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  icon?: React.ReactNode;
};

export const Button = React.forwardRef(
  (
    {children, icon, ...attrs}: ButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => (
    <button
      ref={ref}
      className="py-1 px-2 flex flex-row items-center gap-1 ring-1 ring-brand-200/50 rounded-md transition-colors hover:bg-brand-400/20"
      {...attrs}
    >
      {icon && <div>{icon}</div>}
      <div>{children}</div>
    </button>
  ),
);
Button.displayName = 'Button';
