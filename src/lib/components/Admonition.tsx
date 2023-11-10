import {HiOutlineLightBulb} from 'react-icons/hi';
import {IoMdInformationCircleOutline} from 'react-icons/io';
import {PiWarningBold} from 'react-icons/pi';

export type Type = 'note' | 'warning' | 'tip';

const icons: Record<Type, React.ReactNode> = {
  note: <IoMdInformationCircleOutline alt="Information" />,
  warning: <PiWarningBold alt="Warning" />,
  tip: <HiOutlineLightBulb alt="Lightbulb" />,
};

const classNames: Record<Type, string> = {
  note: 'text-indigo-100 bg-indigo-600/20 ring-indigo-400/10 shadow-indigo-500/70',
  warning:
    'text-amber-100 bg-amber-600/20 ring-amber-300/30 shadow-amber-500/100',
  tip: 'text-teal-100 bg-teal-600/20 ring-teal-300/30 shadow-teal-500/100',
};

export default function Admonition({
  children,
  type,
}: {
  children: React.ReactNode;
  type: Type;
}) {
  return (
    <div
      className={`flex flex-col pr-4 my-4 rounded-2xl ring-1 shadow-glow ${classNames[type]}`}
    >
      <div className="flex flex-row items-start">
        <div className="text-xl pl-4 pr-2 mt-7">{icons[type]}</div>
        {/* outer div allows for margin collapse */}
        <div>
          <div className="my-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
