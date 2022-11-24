import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeftIcon} from "@heroicons/react/solid"
import { DndContext, DragOverlay, useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import Layout from "@webclient/components/Layout/Layout";
import Button from "@webclient/components/UI/Button/Button";
import Title from "@webclient/components/UI/Title/Title";
import Sider from "@webclient/components/Sider/Sider";
import { useDashboardFetch } from "@core/hooks/data/use-dashboard-fetch";
import { MetricChart } from "@webclient/components/Dashboards/MetricChart";

function DashboardInner(props) {
  const { workspaceid, dashboardid } = props;
  const [activeId, setActiveId] = useState(null);
  const [initialIndex, setInitialIndex] = useState(null);
  const [isSiderOpen, setIsSiderOpen] = useState(false)



  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  const { isError, error, isSuccess, status, data } = useDashboardFetch(
    workspaceid as string,
    dashboardid as string
  );

  const [items, setItems] = React.useState([]);

  useEffect(() => {
    if (data) {
      setItems(
        data?.metrics.map((el, index) => ({
          ...el,
          id: `metric-${index}`,
        }))
      );
    }
  }, [data]);

  if (isError) {
    return <>error: {JSON.stringify(error)}</>;
  }

  if (!isSuccess || data === undefined) {
    return <>status: {status}...</>;
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
    setInitialIndex(items.findIndex((el) => el.id === event.active.id));
  }

  function handleDragEnd(event) {
    setActiveId(null);
  }

  function handleDragOver(event) {
    const { over } = event;

    if (over?.id !== activeId) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);

        return newItems;
      });
    }
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <SortableContext items={items}>
        <Sider isSiderOpen={isSiderOpen} setIsSiderOpen={setIsSiderOpen} title="Add KPI to Dashboard" subTitle="Drag any item to your dashboard" subTitleIcon={<ArrowLeftIcon />}/>
        {isSiderOpen && <div className="w-full h-full top-20 right-0 opacity-30 absolute bg-lead-black-400 z-40 shadow-sider " />}
        <div className={`w-full h-full bg-red-200 ${isSiderOpen ? "opacity-30" : "opacity-0"}`}  />
        <div>
          <div className={`flex justify-between`}>
            <Title
              icon={data.icon}
              title={data.title}
              subtitle={data.description}

            />
            <Button onClick={() => setIsSiderOpen(true)} className="h-fit px-4 py-3 leading-[19px] border-[1px] border-[rgba(0, 0, 0, 0.1)] rounded-[6px] shadow-sm text-[#5B4CCC]" title="+ Add New KPI"></Button>
          </div>
          <div
            ref={setNodeRef}
            className="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          >
            {items.map((metric, index) => {
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
            <DragOverlay>
              {activeId ? (
                <MetricChart
                  isOverlay
                  key={activeId}
                  metric={items.find((el) => el.id === activeId)}
                />
              ) : null}
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
    <div className="relative w-full overflow-hidden">
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
