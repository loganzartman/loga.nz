import {Metadata} from 'next';
import dynamic from 'next/dynamic';

const ReacjinEditor = dynamic(() => import('@/app/reacjin/ReacjinEditor'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'reacjin',
  description: 'simple reacji/slackmoji editor and tools',
};

export default function ReacjinPage() {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
      <ReacjinEditor />
    </div>
  );
}
