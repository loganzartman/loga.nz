import Image from 'next/image';

import imgBannerAnimated from '@/app/home/banner-animated.svg';
import imgCat from '@/app/home/cat.svg';

export default function Home() {
  return (
    <div className="w-full">
      <div className="mt-[calc(max(0,-50vw-100%))] relative w-full flex overflow-hidden justify-center items-center">
        <Image
          src={imgBannerAnimated}
          alt="The outlines of a geometric L and Z on a backdrop of twinkling stars"
          className="select-none w-full max-w-[1200px] min-w-[800px] object-contain"
        />
      </div>
      <div className="fixed bottom-0 left-[10%]">
        <Image
          src={imgCat}
          alt="A sitting cat rendered in a minimal line-drawing style"
          className="select-none w-[calc(min(90px,max(50px,10vmax)))] transition-transform ease-[cubic-bezier(.85,.59,.6,-0.26)] duration-[4s] delay-[1s] hover:translate-y-full hover:duration-[0.2s] hover:ease-in-out hover:delay-0"
        />
      </div>
      <main className="mt-8 flex flex-row justify-center items-center gap-5 text-3xl">
        <div>loganz</div>
        <a
          href="https://github.com/loganzartman"
          className="transition-all duration-200 underline decoration-from-font decoration-dotted underline-offset-2 hover:underline-offset-8 hover:text-[#8080FF] hover:decoration-solid"
        >
          github
        </a>
        <a
          href="https://linkedin.com/in/logan-zartman"
          className="transition-all duration-200 underline decoration-from-font decoration-dotted underline-offset-2 hover:underline-offset-8 hover:text-[#8080FF] hover:decoration-solid"
        >
          linkedin
        </a>
      </main>
    </div>
  );
}
