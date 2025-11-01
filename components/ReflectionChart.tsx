import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ReferenceArea, Area } from 'recharts';
import type { ReflectionEntry } from '../types';

interface ReflectionChartProps {
  data: ReflectionEntry[];
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

type TimeRange = 'week' | 'month' | 'all';

export const ReflectionChart: React.FC<ReflectionChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const chartData = useMemo(() => {
    const sortedData = [...data].reverse(); // Sort data by date ascending
    let filteredData: ReflectionEntry[];

    switch (timeRange) {
      case 'month':
        filteredData = sortedData.slice(-30);
        break;
      case 'all':
        filteredData = sortedData;
        break;
      case 'week':
      default:
        filteredData = sortedData.slice(-7);
        break;
    }
    return filteredData.map(entry => ({
      ...entry,
      name: formatDate(entry.date)
    }));
  }, [data, timeRange]);

  const getButtonClass = (range: TimeRange) => {
    return `px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
      timeRange === range
        ? 'bg-brand-dark text-white shadow-md'
        : 'bg-gray-200/80 text-gray-700 hover:bg-gray-300'
    }`;
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-center items-center mb-4 gap-2 sm:gap-4">
        <h3 className="text-xl font-bold font-rounded text-brand-dark">Wellness Trend</h3>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-full">
          <button onClick={() => setTimeRange('week')} className={getButtonClass('week')}>1週間</button>
          <button onClick={() => setTimeRange('month')} className={getButtonClass('month')}>1ヶ月</button>
          <button onClick={() => setTimeRange('all')} className={getButtonClass('all')}>全期間</button>
        </div>
      </div>

      <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#344955" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#344955" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                <XAxis dataKey="name" stroke="#344955" />
                <YAxis yAxisId="left" domain={[1, 10]} stroke="#344955" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#A8D8C980" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <ReferenceArea yAxisId="right" y1={65} y2={85} fill="#A8D8C9" fillOpacity={0.2} label={{ value: 'Ideal Zone', position: 'insideTopLeft', fill: '#344955', fontSize: 12, dy: 10, dx: 10 }} />
                
                <Area yAxisId="right" type="monotone" dataKey="totalScore" stroke="#344955" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} name="Total Score" />

                <Line yAxisId="left" type="monotone" dataKey="vibration" name="Vibration" stroke="#A8D8C9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                <Line yAxisId="left" type="monotone" dataKey="balance" name="Balance" stroke="#F4D35E" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                <Line yAxisId="left" type="monotone" dataKey="energy" name="Energy" stroke="#4E8A9C" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
            </ComposedChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};