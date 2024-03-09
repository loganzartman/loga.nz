import {Metadata} from 'next';

import {ReacjinEditor} from '@/app/reacjin/ReacjinEditor';

export const metadata: Metadata = {
  title: 'reacjin',
  description: 'reacji editor and tools',
};

export default function ReacjinPage() {
  return (
    <div className="absolute top-32 left-0 right-0 bottom-0">
      <ReacjinEditor />
    </div>
  );
}
