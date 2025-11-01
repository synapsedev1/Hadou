
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea, Area } from 'recharts';
import type { ReflectionEntry } from '../types';

interface ReflectionChartProps {
  data: ReflectionEntry[];
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

type TimeRange = 'week' | 'month' | 'all';


// --- Visual Enhancements ---

interface ScoreInfo {
  status: string;
  message: string;
  emoji: string;
  color: string;
}

const getScoreInfo = (score: number): ScoreInfo => {
  if (score >= 86) {
    return { status: "過集中", message: "", emoji: "❤️", color: "text-brand-red" };
  }
  if (score >= 65) {
    return { status: "安定", message: "", emoji: "💚", color: "text-brand-green" };
  }
  if (score >= 45) {
    return { status: "ゆらぎ", message: "", emoji: "💛", color: "text-brand-gold" };
  }
  return { status: "低調", message: "", emoji: "💙", color: "text-brand-blue" };
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as ReflectionEntry & { name: string };
        const scoreInfo = getScoreInfo(data.total_score);
        const date = new Date(data.date);
        const weekday = new Intl.DateTimeFormat('ja-JP', { weekday: 'short' }).format(date);

        return (
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200/50 transition-all">
                <p className="font-bold text-brand-dark text-center mb-1">{data.name} ({weekday})</p>
                <p className={`text-4xl font-bold font-rounded my-1 text-center ${scoreInfo.color}`}>{data.total_score}</p>
                <p className={`text-sm font-semibold text-center ${scoreInfo.color}`}>{scoreInfo.status}</p>
                {data.note && <p className="mt-3 text-xs text-gray-700 bg-gray-100/50 p-2 rounded max-w-[200px] whitespace-pre-wrap break-words">{data.note}</p>}
            </div>
        );
    }
    return null;
};

const PulsingDot = (props: any) => {
    const { cx, cy, payload } = props;
    const todayString = new Date().toISOString().split('T')[0];

    if (payload.date === todayString) {
        return (
            <g>
                <style>{`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(2.5); opacity: 0; }
                        100% { transform: scale(2.5); opacity: 0; }
                    }
                `}</style>
                <circle cx={cx} cy={cy} r="8" fill="#344955" fillOpacity="0.3">
                    <animate attributeName="r" from="8" to="20" dur="2s" begin="0s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
                </circle>
                <circle cx={cx} cy={cy} r={6} fill="#344955" stroke="white" strokeWidth="2" />
            </g>
        );
    }

    return <circle cx={cx} cy={cy} r={5} fill="#344955" />;
};


const Sparkles = () => {
    const sparkles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * 5}s`,
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <style>{`
                @keyframes sparkle {
                    0% { transform: scale(0) rotate(0deg); opacity: 0.5; }
                    50% { transform: scale(1) rotate(180deg); opacity: 1; }
                    100% { transform: scale(0) rotate(360deg); opacity: 0.5; }
                }
                .sparkle-item {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background-color: #F4D35E; /* brand-gold */
                    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                    animation-name: sparkle;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                }
            `}</style>
            {sparkles.map(s => (
                <div key={s.id} className="sparkle-item" style={{ top: s.top, left: s.left, animationDuration: s.animationDuration, animationDelay: s.animationDelay }} />
            ))}
        </div>
    )
}

// --- Chart Component ---

export const ReflectionChart: React.FC<ReflectionChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const chartData = useMemo(() => {
    const sortedData = [...data].reverse(); 
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

      <div className="w-full h-80 relative">
          <Sparkles />
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A8D8C9" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#A8D8C9" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                <XAxis dataKey="name" stroke="#344955" />
                <YAxis domain={[0, 100]} stroke="#344955" />
                <Tooltip
                  cursor={{ stroke: '#344955', strokeWidth: 1, strokeDasharray: '3 3' }}
                  content={<CustomTooltip />}
                />
                <ReferenceArea y1={65} y2={85} fill="#A8D8C9" fillOpacity={0.2} label={{ value: 'Ideal Zone', position: 'insideTopLeft', fill: '#344955', fontSize: 12, dy: 10, dx: 10 }} />
                
                <Area 
                  type="monotone" 
                  dataKey="total_score" 
                  stroke="#344955" 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  strokeWidth={3} 
                  name="Total Score" 
                  dot={<PulsingDot />}
                  activeDot={{ r: 7, stroke: '#344955', strokeWidth: 2 }}
                />
            </ComposedChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};
