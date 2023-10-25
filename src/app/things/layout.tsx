import BannerShort from '@/image/banner-short-animated.svg';

export default function ThingsLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col items-center p-8 pb-12">
      <div className="absolute overflow-hidden top-0 left-0 right-0 flex flex-col items-center">
        <BannerShort
          alt={'twinkle'}
          className="select-none max-w-[1200px] min-w-[900px]"
        />
      </div>
      <div className="relative mt-32">{children}</div>
    </div>
  );
}
