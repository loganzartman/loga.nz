'use client';

import {MouseEventHandler, useState} from 'react';

import Ring from '@/app/blog/posts/consistent-hashing/Ring';

function Button({
  onClick,
  children,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}) {
  return (
    <button
      className="px-2 py-1 ring-1 ring-brand-200 rounded-full"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function FlattenRing() {
  const [seed, setSeed] = useState(42);
  const [circle, setCircle] = useState(false);
  const [serverCount, setServerCount] = useState(3);
  const servers = Array.from({length: serverCount}).map((_, i) => `S${i}`);
  return (
    <div className="flex flex-col">
      <Ring
        servers={servers}
        keys={['K1', 'K2', 'K3']}
        circle={circle}
        seed={seed}
      />
      <label className="flex flex-row gap-2">
        <input
          type="checkbox"
          checked={!circle}
          onChange={(e) => setCircle(!e.target.checked)}
        />
        Flatten
      </label>
      <label className="flex flex-row gap-2">
        Servers
        <input
          type="range"
          min="1"
          max="6"
          step="1"
          value={serverCount}
          onChange={(e) => setServerCount(e.target.valueAsNumber)}
        />
      </label>
      <Button onClick={() => setSeed(Math.random() * 1000)}>
        Randomize seed
      </Button>
    </div>
  );
}
