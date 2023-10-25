import Link from 'next/link';

import Arrow from '@/image/arrow.svg';
import BannerAnimated from '@/image/banner-animated.svg';
import Cat from '@/image/cat.svg';

export default function Home() {
  return (
    <div className="">
      <div className="mt-[calc(max(0,-50vw-100%))] relative flex overflow-hidden justify-center items-center">
        <BannerAnimated
          alt="The outlines of a geometric L and Z on a backdrop of twinkling stars"
          className="select-none max-w-[1200px] min-w-[900px]"
        />
      </div>
      <div className="fixed bottom-0 left-[10%]">
        <Cat
          alt="A sitting cat rendered in a minimal line-drawing style"
          className="select-none w-[calc(min(90px,max(50px,10vmax)))] transition-transform ease-[cubic-bezier(.85,.59,.6,-0.26)] duration-[4s] delay-[1s] hover:translate-y-full hover:duration-[0.2s] hover:ease-in-out hover:delay-0"
        />
      </div>
      <main className="-mt-8 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="font-display text-5xl md:text-7xl">
            hey, i&apos;m Logan
          </div>
          <div className="flex flex-row gap-4 mt-5 text-2xl md:text-3xl">
            <div>i&apos;m on:</div>
            <a
              href="https://github.com/loganzartman"
              className="transition-all duration-200 text-brand-300 underline decoration-dotted p-2 -m-2 underline-offset-2 hover:underline-offset-8 hover:text-highlight hover:decoration-solid"
            >
              github
            </a>
            <a
              href="https://linkedin.com/in/logan-zartman"
              className="transition-all duration-200 text-brand-300 underline decoration-dotted p-2 -m-2 underline-offset-2 hover:underline-offset-8 hover:text-highlight hover:decoration-solid"
            >
              linkedin
            </a>
          </div>
        </div>
        <div className="group transition-all mt-10 hover:text-highlight hover:stroke-highlight">
          <Link href="/blog" className="flex flex-col items-center mb-10">
            <div className="flex flex-row items-center mb-1 text-3xl">
              <div className="font-serif mr-2">read my blog?</div>
              <Arrow className="transition-transform h-[1.5em] group-hover:translate-x-3" />
            </div>
            <div className="text-sm -mt-2">it&apos;s about computers.</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
