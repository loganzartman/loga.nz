import {Metadata} from 'next';

import {ReacjinEditor} from '@/app/reacjin/ReacjinEditor';

export const metadata: Metadata = {
  title: 'reacjin',
  description: 'simple reacji/slackmoji editor and tools',
};

export default function ReacjinPage() {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0">
      <ReacjinEditor />
    </div>
  );
}
