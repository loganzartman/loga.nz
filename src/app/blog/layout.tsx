import BannerShort from '@/image/banner-short-animated.svg';

export default function BlogLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="w-full flex flex-col items-center pb-12">
      <div className="w-full overflow-hidden flex flex-col items-center">
        <BannerShort
          alt={'twinkle'}
          className="select-none w-full max-w-[1200px] min-w-[800px] object-contain"
        />
      </div>
      <div className="-mt-20">{children}</div>
    </div>
  );
}
