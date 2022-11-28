import { useState } from "react";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { ArrowsExpandIcon } from "@heroicons/react/solid";
import { classNames } from "@core/react/class-names";
import { Conditional } from "@core/react/conditional";
import { dateFormatter } from "@core/standards/date-formatter";
import { MetricPieChart } from "./MetricPieChart";
import { MetricLineChart } from "./MetricLineChart";
import { MetricBarChart } from "./MetricBarChart";
import { MetricTableChart } from "./MetricTableChart";
import { MetricSingleValueChart } from "./MetricSingleValueChart";
import ResizeIcon from "@webclient/components/Icons/Drag";

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

function MetricChart(props) {
  const {
    metric,
    activeId,
    isOverlay,
    isInitialIndex,
    showResizeIcon = true,
    className,
    mode,
  } = props;
  const params = GetParametersByChartType(metric.chart_type);

  const sizes = ["small", "medium", "large"];
  const [size, setSize] = useState(props.metric.size);

  const resizeClick = (e) => {
    setSize(sizes[(sizes.indexOf(size) + 1) % sizes.length]);

    e.preventDefault();
  };

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

          <div className="h-4 w-4 text-slate-400">
            <Link href=".">
              <a
                onClick={(e) => resizeClick(e)}
                className="hidden group-hover:block"
              >
                <ArrowsExpandIcon />
              </a>
            </Link>
          </div>
        </div>

        <div className="grow flex flex-col justify-center ">
          <div>
            <params.component metric={props.metric} size={size} />
          </div>
        </div>
        <button className="appearance-none border-none outline-none hidden justify-end items-end absolute bottom-4 right-4 w-4 h-4 group-hover:cursor-nwse-resize group-hover:flex">
          <ResizeIcon fill="currentColor" />
        </button>
        <Conditional if={showResizeIcon}>
          <button
            ref={mode !== "new-in-sider" ? setActivatorNodeRef : undefined}
            {...(mode !== "new-in-sider" ? listeners : {})}
            {...(mode !== "new-in-sider" ? attributes : {})}
            className="rotate-45 text-slate-400 appearance-none border-none outline-none hidden justify-end items-end absolute bottom-4 left-4 w-4 h-4 group-hover:cursor-grab group-hover:flex"
          >
            <ArrowsExpandIcon />
          </button>
        </Conditional>
      </div>
    </div>
  );
}

export { MetricChart, MetricChart as default };
