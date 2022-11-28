export type Metric = {
  id: string;
  title: string;
  size: string;
  icon: string;
  data: Data[];
  chart_type: string;
  color: string;
  goal: number;
  value: number;
  source: null;
  sys: {
    created_at: Date;
    created_by: { full_name: string };
  };
  mode: string;
};

export type Data = {
  name: string;
  time: Date;
  value: number;
};