import { PlusIcon } from "@heroicons/react/solid";
import classNames from "@webclient/../core/src/react/class-names";
import Conditional from "@webclient/../core/src/react/conditional";

type SiderProps = React.PropsWithChildren<{
  className?: string;
  title?: string;
  subTitle?: string;
  subTitleIcon?: React.ReactNode;
  isSiderOpen?: boolean;
  overlayHidden?: boolean;
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
  overlayHidden,
}) => {
  return (
    <>
      <div
        className={`fixed h-screen transition-all duration-200 ease-linear shadow-[-2px 0px 10px rgba(0, 0, 0, 0.1)] top-20 bg-white w-[410px] dark:bg-slate-800 z-50 ${
          isSiderOpen
            ? "right-0 max-w-xl overflow-scroll"
            : "right-[-410px] max-w-0 box-border overflow-hidden"
        } ${className}`}
      >
        <div className=" pl-[28px] pr-[32px] flex flex-col mb-10 pb-[80px] relative">
          <div className="flex flex-col ritual-cyan-800 font-semibold text-[18px] sticky z-50 bg-white pt-10 pb-5 left-0 top-0 w-full">
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
              <div className="flex items-center gap-1 text-[13px] text-lead-black-400">
                <Conditional if={subTitleIcon !== undefined}>
                  <div className="w-4">{subTitleIcon} </div>
                </Conditional>
                {subTitle}
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
      {isSiderOpen && (
        <div
          onClick={() => {
            setIsSiderOpen(false);
          }}
          className={classNames([
            "w-full h-full top-0 right-0 opacity-30 fixed bg-lead-black-400 z-40 shadow-sider transition-opacity duration-300 ease-in-out",
            overlayHidden && "opacity-0",
          ])}
        />
      )}
    </>
  );
};

export default Sider;
