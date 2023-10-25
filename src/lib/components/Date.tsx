'use client';

export default function Date({
  date,
  className,
}: {
  date: Date;
  className?: string;
}) {
  return <div className={className}>{date.toLocaleDateString()}</div>;
}
