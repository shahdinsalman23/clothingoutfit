"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { BarChart3 } from "lucide-react";

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#0ea5e9",
  processing: "#06b6d4",
  shipped: "var(--gold)",
  delivered: "#10b981",
  cancelled: "#ef4444",
  returned: "var(--muted)",
};

const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

function EmptyChart({ title, text }) {
  return (
    <div className="shopmate-empty-dashad">
      <div className="shopmate-empty-icon-dashad">
        <BarChart3 size={26} />
      </div>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function RevenueTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="shopmate-tooltip-dashad">
      <span className="shopmate-tooltip-date-dashad">{row.label}</span>
      <strong>PKR {Math.round(row.revenue).toLocaleString("en-PK")}</strong>
      <small>
        {row.orders} {row.orders === 1 ? "order" : "orders"}
      </small>
    </div>
  );
}

export function RevenueChart({ data }) {
  const [range, setRange] = useState(30);

  const visible = useMemo(() => data.slice(-range), [data, range]);
  const totalRevenue = visible.reduce((total, row) => total + row.revenue, 0);
  const totalOrders = visible.reduce((total, row) => total + row.orders, 0);

  return (
    <div className="shopmate-chart-body-dashad">
      <div className="shopmate-chart-toolbar-dashad">
        <div className="shopmate-chart-summary-dashad">
          <div>
            <small>Revenue</small>
            <strong>PKR {Math.round(totalRevenue).toLocaleString("en-PK")}</strong>
          </div>
          <div>
            <small>Orders</small>
            <strong>{totalOrders}</strong>
          </div>
        </div>

        <div className="shopmate-range-dashad" role="tablist">
          {RANGES.map((item) => (
            <button
              key={item.days}
              type="button"
              role="tab"
              aria-selected={range === item.days}
              className={range === item.days ? "active-dashad" : ""}
              onClick={() => setRange(item.days)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="shopmate-chart-area-dashad">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={visible} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradientDashad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={28}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              tickFormatter={(value) => compact.format(value)}
              width={52}
            />
            <Tooltip
              content={<RevenueTooltip />}
              cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--gold)"
              strokeWidth={2.5}
              fill="url(#revenueGradientDashad)"
              activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--bg)", fill: "var(--gold)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StatusChart({ data, total }) {
  if (!data.length) {
    return <EmptyChart title="No orders yet" text="Status breakdown will appear here." />;
  }

  return (
    <div className="shopmate-chart-body-dashad">
      <div className="shopmate-donut-dashad">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="92%"
              paddingAngle={3}
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "var(--muted)"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, String(name).toUpperCase()]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                boxShadow: "0 10px 25px -5px rgba(15,23,42,0.12)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="shopmate-donut-center-dashad">
          <strong>{total}</strong>
          <small>Total orders</small>
        </div>
      </div>

      <ul className="shopmate-legend-dashad">
        {data.map((entry) => (
          <li key={entry.name}>
            <span
              className="shopmate-legend-dot-dashad"
              style={{ backgroundColor: STATUS_COLORS[entry.name] || "var(--muted)" }}
            />
            <span className="shopmate-legend-name-dashad">{entry.name}</span>
            <strong>{entry.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopProductsChart({ data }) {
  if (!data.length) {
    return (
      <EmptyChart
        title="No sales data yet"
        text="Best sellers will appear once orders contain items."
      />
    );
  }

  const rows = data.map((item) => ({
    ...item,
    short: item.name.length > 16 ? `${item.name.slice(0, 15)}…` : item.name,
  }));

  return (
    <div className="shopmate-chart-body-dashad">
      <div className="shopmate-bar-area-dashad">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barGradientDashad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--gold)" />
                <stop offset="100%" stopColor="var(--gold-dark)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="short"
              tickLine={false}
              axisLine={false}
              width={110}
              tick={{ fill: "var(--text-soft)", fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: "var(--bg)" }}
              formatter={(value) => [`${value} units`, "Sold"]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ""}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                boxShadow: "0 10px 25px -5px rgba(15,23,42,0.12)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="sold" fill="url(#barGradientDashad)" radius={[0, 8, 8, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}