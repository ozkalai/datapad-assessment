import { PlusIcon } from "@heroicons/react/solid";
import Conditional from "@webclient/../core/src/react/conditional";

type SiderProps = React.PropsWithChildren<{
  className?: string;
  title?: string;
  subTitle?: string;
  subTitleIcon?: React.ReactNode;
  isSiderOpen?: boolean;
  setIsSiderOpen?: (isSiderOpen: boolean) => void;
}>;

const Sider: React.FC<SiderProps> = ({
  className,
  title,
  subTitle,
  subTitleIcon,
  children,
  isSiderOpen,
  setIsSiderOpen,
}) => {
  return (
    <div
      className={`absolute transition-all duration-200 ease-linear shadow-[-2px 0px 10px rgba(0, 0, 0, 0.1)] top-20 bg-white w-[410px] dark:bg-slate-800 min-h-full z-50 py-10 pl-[28px] pr-[32px] ${isSiderOpen ? 'right-0' : 'right-[-420px]'} ${className}`}
    >
      <div className="flex flex-col ritual-cyan-800 font-semibold  text-[18px] ">
        <div className="flex flex-col ">
          <div className="flex items-center justify-between w-full">

          <Conditional if={title !== undefined}>
            <>{title} </>
          </Conditional>
          <PlusIcon
          fontWeight={500}
          width={17}
          height={17}
          className="rotate-45 cursor-pointer"
          onClick={() => setIsSiderOpen(false)}
          
        />
        </div>
         
        </div>
        {subTitle && (
            <div className="flex items-center gap-2 text-[13px] text-lead-black-400">
              <Conditional if={subTitleIcon !== undefined}>
                <div className="w-4">{subTitleIcon} </div>
              </Conditional>
              {subTitle}
            </div>
          )}
       
      </div>
      {children}
    </div>
  );
};

export default Sider;
