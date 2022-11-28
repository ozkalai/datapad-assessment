import { useCallback, useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { ArrowsExpandIcon } from "@heroicons/react/solid";
import { DotsHorizontalIcon, XIcon } from "@heroicons/react/outline";

import { classNames } from "@core/react/class-names";
import { Conditional } from "@core/react/conditional";
import { dateFormatter } from "@core/standards/date-formatter";
import { MetricPieChart } from "./MetricPieChart";
import { MetricLineChart } from "./MetricLineChart";
import { MetricBarChart } from "./MetricBarChart";
import { MetricTableChart } from "./MetricTableChart";
import { MetricSingleValueChart } from "./MetricSingleValueChart";
import ResizeIcon from "@webclient/components/Icons/Drag";
import ContextMenu from "../ContextMenu/ContextMenu";
import { getAngle, getDistance } from "@webclient/utils/calculate";

function GetParametersByChartType(chartType) {
  if (chartType === "BAR_CHART") {
    return {
      component: MetricBarChart,
      showGoal: true,
      showDate: false,
    };
  }

  if (chartType === "PIE_CHART") {
    return {
      component: MetricPieChart,
      showGoal: true,
      showDate: false,
    };
  }

  if (chartType === "LINE_CHART") {
    return {
      component: MetricLineChart,
      showGoal: true,
      showDate: false,
    };
  }

  if (chartType === "TABLE_CHART") {
    return {
      component: MetricTableChart,
      showGoal: false,
      showDate: false,
    };
  }

  if (chartType === undefined) {
    return {
      component: MetricSingleValueChart,
      showGoal: true,
      showDate: true,
    };
  }

  throw new Error(`invalid chart type: {chartType}`);
}

const sizes = ["small", "medium", "large"];

function MetricChart(props) {
  const {
    metric,
    activeId,
    isOverlay,
    isInitialIndex,
    showResizeIcon = true,
    className,
    onRemove,
    mode,
  } = props;
  const params = GetParametersByChartType(metric.chart_type);

  const [size, setSize] = useState(props.metric.size);

  const [isResizing, setIsResizing] = useState(false);

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transition } =
    useSortable({
      id: metric.id,
      data: {
        mode: metric.mode,
      },
      disabled: isOverlay,
    });

  const style = {
    transition,
  };

  const startPoints = useRef(null);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (startPoints.current === null) {
        return;
      }

      const { clientX, clientY } = event;

      const windowWidth = Math.min(window.innerWidth, 1536);

      const distance = getDistance(
        startPoints.current.x,
        startPoints.current.y,
        clientX,
        clientY
      );

      const angle = getAngle(
        startPoints.current.x,
        startPoints.current.y,
        clientX,
        clientY
      );

      const threshold = (windowWidth / 100) * 10;

      if (distance > threshold) {
        if (angle < 270 && angle > 90) {
          if (size === "small") {
            return;
          }
          setSize(sizes[Math.max(0, sizes.indexOf(size) - 1)]);
          startPoints.current = {
            x: clientX,
            y: clientY,
          };
        } else {
          if (size === "large") {
            return;
          }
          const nextSize = sizes[(sizes.indexOf(size) + 1) % sizes.length];
          setSize(nextSize);
          startPoints.current = {
            x: clientX,
            y: clientY,
          };
        }
      }
    },
    [size]
  );

  useEffect(() => {
    const handlePointerUp = () => {
      startPoints.current = null;
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    } else {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, isResizing]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      setIsResizing(true);
      startPoints.current = {
        x: event.clientX,
        y: event.clientY,
      };
    },
    []
  );

  return (
    <div
      {...(mode === "new-in-sider" ? listeners : {})}
      {...(mode === "new-in-sider" ? attributes : {})}
      style={style}
      ref={mode !== "new-in-sider" ? setNodeRef : setActivatorNodeRef}
      className={classNames([
        "flex flex-col h-full shadow-sm dark:bg-slate-800 bg-white rounded-lg group p-4 relative",
        size === "medium" && "col-span-2 row-span-1",
        size === "large" && "col-span-3 row-span-2",
        metric.id === activeId && !isInitialIndex
          ? "border-dashed border-2 border-purple-400 bg-transparent"
          : "",
        isInitialIndex &&
          metric.id === activeId &&
          "border-dashed border-2 border-gray-500 bg-transparent",
        isOverlay && "shadow-2xl cursor-grabbing",
        isResizing && "cursor- cursor-nwse-resize shadow-2xl",
        className,
      ])}
    >
      <div
        className={classNames([
          "flex flex-col h-full",
          (isInitialIndex && activeId === metric.id) || metric.id === activeId
            ? "opacity-0"
            : "opacity-100",
        ])}
      >
        <div className={classNames(["flex justify-between"])}>
          <div>
            <Conditional if={params.showGoal}>
              <h3 className="text-lg">{props.metric.goal}</h3>
            </Conditional>
            <h3
              className={classNames([
                "mt-2 grow-0 text-base",
                `text-{color.hardClass}`,
              ])}
            >
              {props.metric.icon} {props.metric.title}
            </h3>
            <Conditional if={params.showDate}>
              <h3 className="mt-2 text-base text-gray-400">
                {dateFormatter(
                  props.metric.sys.updated_at ?? props.metric.sys.created_at
                )}
              </h3>
            </Conditional>
          </div>
          <Conditional if={mode !== "new-in-sider"}>
            <div className="h-4 w-4">
              <ContextMenu
                items={[
                  {
                    label: (
                      <div className="flex items-center gap-2">
                        <XIcon className="text-krasnyi-red-500 w-4 h-4" />
                        <span>Remove</span>
                      </div>
                    ),
                    onClick: onRemove,
                  },
                ]}
              >
                <a className="hidden group-hover:block cursor-pointer">
                  <DotsHorizontalIcon className="opacity-30 cursor-pointer" />
                </a>
              </ContextMenu>
            </div>
          </Conditional>
        </div>

        <div className="grow flex flex-col justify-center ">
          <div>
            <params.component metric={props.metric} size={size} />
          </div>
        </div>
        <Conditional if={mode !== "new-in-sider"}>
          <button
            onPointerDown={handlePointerDown}
            className="appearance-none border-none outline-none hidden justify-end items-end absolute bottom-4 right-4 w-4 h-4 group-hover:cursor-nwse-resize group-hover:flex "
          >
            <ResizeIcon className="opacity-10 dark:opacity-30 dark:fill-white" />
          </button>
        </Conditional>
        <Conditional if={showResizeIcon && mode !== "new-in-sider"}>
          <button
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            className="rotate-45 appearance-none border-none outline-none hidden justify-end items-end absolute bottom-4 left-4 w-4 h-4 group-hover:cursor-grab group-hover:flex"
          >
            <ArrowsExpandIcon className="opacity-30" />
          </button>
        </Conditional>
      </div>
    </div>
  );
}

export { MetricChart, MetricChart as default };
