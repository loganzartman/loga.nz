const WIP_RING = 'https://ring.loga.nz';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'fairy-ring': React.HTMLAttributes<HTMLElement> & {'config-url': string};
    }
  }
}

export default function Footer() {
  return (
    <footer className="my-16 flex justify-center">
      {/* react hoists these into <head> */}
      <link
        rel="stylesheet"
        href={`${WIP_RING}/fairy-ring.css`}
        precedence="default"
      />
      <script
        async
        type="module"
        src="https://cdn.jsdelivr.net/npm/fairy-ring@0.2/dist/standalone.js"
      />
      <fairy-ring
        className="wip-ring"
        config-url={`${WIP_RING}/fairy-ring.toml`}
      />
    </footer>
  );
}
