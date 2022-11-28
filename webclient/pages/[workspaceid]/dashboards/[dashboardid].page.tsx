import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { DndContext, DragOverlay, Modifier, useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@webclient/components/Layout/Layout";
import Button from "@webclient/components/UI/Button/Button";
import Title from "@webclient/components/UI/Title/Title";
import Sider from "@webclient/components/Sider/Sider";
import { useDashboardFetch } from "@core/hooks/data/use-dashboard-fetch";
import useMetricsAllFetch from "@core/hooks/data/use-metrics-all-fetch";
import { MetricChart } from "@webclient/components/Dashboards/MetricChart";
import { Metric, Data } from "@webclient/types/KPI";
import {
  isTouchEvent,
  isMouseEvent,
  getEventCoordinates,
} from "@webclient/utils/events";

function DashboardInner(props) {
  const { workspaceid, dashboardid } = props;
  const [activeId, setActiveId] = useState(null);
  const [initialIndex, setInitialIndex] = useState(null);
  const [isSiderOpen, setIsSiderOpen] = useState(false);

  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  const { isError, error, isSuccess, status, data } = useDashboardFetch(
    workspaceid as string,
    dashboardid as string
  );

  const { isSuccess: allMetricsIsSuccess, data: allMetricsData } =
    useMetricsAllFetch(workspaceid as string);

  const timeoutRef = React.useRef(null);
  const [dashboardKPIs, setDashboardKPIs] = React.useState<Metric[]>([]);
  const [allKPIs, setAllKPIs] = React.useState<Metric[]>([]);

  useEffect(() => {
    if (isSuccess) {
      const dashboardMetricsWithIds = data?.metrics?.map((metric, index) => ({
        ...metric,
        id: uuidv4(),
      }));
      setDashboardKPIs(dashboardMetricsWithIds);
    }
  }, [isSuccess, data, dashboardid]);

  useEffect(() => {
    if (allMetricsIsSuccess) {
      const allMetricsWithIds = allMetricsData?.map((metric, index) => ({
        ...metric,
        id: uuidv4(),
      }));
      setAllKPIs(allMetricsWithIds);
    }
  }, [allMetricsIsSuccess, allMetricsData]);

  if (isError) {
    return <>error: {JSON.stringify(error)}</>;
  }

  if (!isSuccess || data === undefined) {
    return <>status: {status}...</>;
  }

  function handleDragStart(event) {
    if (!dashboardKPIs.find((metric) => metric.id === event.active.id)) {
      setDashboardKPIs((prev) => {
        const newMetric = allKPIs.find(
          (metric) => metric.id === event.active.id
        );
        return [{ ...newMetric, mode: "new-in-list", size: "small" }, ...prev];
      });
    }
    if (isSiderOpen) {
      timeoutRef.current = setTimeout(() => {
        setActiveId(event.active.id);

        timeoutRef.current = null;
      }, 200);
    } else {
      setActiveId(event.active.id);
    }

    setInitialIndex(dashboardKPIs.findIndex((el) => el.id === event.active.id));
  }

  function handleDragEnd(event) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveId(null);
    if (dashboardKPIs.find((el) => el.mode === "new-in-list")) {
      toast("KPI added succesfully to the dashboard!", {
        type: "success",
      });
    }

    setDashboardKPIs((prev) => prev.map((el) => ({ ...el, mode: undefined })));
  }

  function handleDragOver(event) {
    const { over } = event;

    if (over?.id !== activeId) {
      setDashboardKPIs((dashboardKPIs) => {
        const oldIndex = dashboardKPIs.findIndex(
          (item) => item.id === activeId
        );
        const newIndex = dashboardKPIs.findIndex(
          (item) => item.id === over?.id
        );

        const newItems = [...dashboardKPIs];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);

        return newItems;
      });
    }
  }

  const alignWithCursorForNewKPIs: Modifier = ({
    activatorEvent,
    activeNodeRect,
    transform,
    active,
  }) => {
    if (
      active?.data?.current?.mode === "new-in-list" &&
      activeNodeRect &&
      activatorEvent &&
      (isTouchEvent(activatorEvent) || isMouseEvent(activatorEvent))
    ) {
      const activatorCoordinates = getEventCoordinates(activatorEvent);
      const offsetX = activatorCoordinates.x;
      const offsetY = activatorCoordinates.y;

      return {
        ...transform,
        x: transform.x + offsetX - activeNodeRect.width,
        y: transform.y + offsetY - activeNodeRect.height,
      };
    }

    return transform;
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <ToastContainer autoClose={2000} />
      <SortableContext items={allKPIs}>
        <Sider
          isSiderOpen={isSiderOpen}
          setIsSiderOpen={setIsSiderOpen}
          title="Add KPI to Dashboard"
          subTitle="Drag any item to your dashboard"
          subTitleIcon={<ArrowLeftIcon />}
          overlayHidden={!!activeId}
        >
          <div className="mt-6 flex flex-col gap-8 " ref={setNodeRef}>
            {allKPIs
              ?.filter((metric) => {
                return !dashboardKPIs.find(
                  (dashboardMetric) => dashboardMetric.id === metric.id
                );
              })
              .map((metric, index) => {
                return (
                  <MetricChart
                    key={metric.id}
                    className="border-[1px] rounded-lg"
                    mode="new-in-sider"
                    isInitialIndex={initialIndex === index}
                    activeId={activeId}
                    metric={metric}
                  />
                );
              })}
          </div>
        </Sider>
      </SortableContext>
      <SortableContext items={dashboardKPIs}>
        <div>
          <div className={`flex justify-between`}>
            <Title
              icon={data.icon}
              title={data.title}
              subtitle={data.description}
            />
            <Button
              onClick={() => setIsSiderOpen(true)}
              className="h-fit px-4 py-3 leading-[19px] border-[1px] border-[rgba(0, 0, 0, 0.1)] rounded-[6px] shadow-sm text-[#5B4CCC]"
              title="+ Add New KPI"
            ></Button>
          </div>
          <div
            ref={setNodeRef}
            className="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          >
            {dashboardKPIs?.map((metric, index) => {
              return (
                <React.Fragment key={metric.id}>
                  <MetricChart
                    isInitialIndex={initialIndex === index}
                    activeId={activeId}
                    metric={metric}
                  />
                </React.Fragment>
              );
            })}
            <DragOverlay
              dropAnimation={null}
              modifiers={[alignWithCursorForNewKPIs]}
            >
              {activeId && (
                <MetricChart
                  isOverlay
                  key={activeId}
                  metric={dashboardKPIs.find((el) => el.id === activeId)}
                />
              )}
            </DragOverlay>
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const { workspaceid, dashboardid } = router.query;

  // sorry for this next.js
  if (workspaceid === undefined || dashboardid === undefined) {
    return null;
  }

  return (
    <div className="relative w-full overflow-x-hidden ">
      <Head>
        <title>
          Datapad - Workspace #{workspaceid} - Dashboard #${dashboardid}
        </title>
        <meta
          name="description"
          content={`Datapad - Workspace #${workspaceid} - Dashboard #${dashboardid}`}
        />
      </Head>

      <Layout title={`Workspace #${workspaceid} - Dashboard #${dashboardid}`}>
        <div className={`mt-5`}>
          <DashboardInner workspaceid={workspaceid} dashboardid={dashboardid} />
        </div>
        <ul className="mt-5">
          <li>
            <Link href={`/${workspaceid}/dashboards/`}>
              <Button
                className="datapad-button"
                loading={false}
                title="Go Back"
              />
            </Link>
          </li>
        </ul>
      </Layout>
    </div>
  );
}
