/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  // CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { theme } from './theme';

interface AreaChartProps {
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
}

export function AreaChartComponent({
  data,
  categories,
  index,
  colors = [theme.colors.primary, theme.colors.secondary],
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} /> */}
        <XAxis
          dataKey={index}
          stroke={theme.colors.border2}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={theme.colors.border2}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            borderRadius: '8px',
            color: theme.colors.text
          }}
        />
        <Legend />
        
        {categories.map((category, i) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            fill={`url(#color${i})`}
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        ))}
        
        <defs>
          {categories.map((_, i) => (
            <linearGradient
              key={i}
              id={`color${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={colors[i % colors.length]}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={colors[i % colors.length]}
                stopOpacity={0.1}
              />
            </linearGradient>
          ))}
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
}