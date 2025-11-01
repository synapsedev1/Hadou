
import React from 'react';

interface ScoreCardProps {
  score: number;
}

interface ScoreInfo {
  status: string;
  message: string;
  emoji: string;
  color: string;
}

const getScoreInfo = (score: number): ScoreInfo => {
  if (score >= 86) {
    return {
      status: "過集中",
      message: "今日はとても集中できた一方で、少し頑張りすぎかも。ゆるめてOKです🌸",
      emoji: "❤️",
      color: "text-brand-red",
    };
  }
  if (score >= 65) {
    return {
      status: "安定",
      message: "今日のあなたはちょうど良いバランスでしたね。穏やかに休みましょう☺️",
      emoji: "💚",
      color: "text-brand-green",
    };
  }
  if (score >= 45) {
    return {
      status: "ゆらぎ",
      message: "少し波がありましたね。でも、それも自然の流れです🍃",
      emoji: "💛",
      color: "text-brand-gold",
    };
  }
  return {
    status: "低調",
    message: "今日は無理せず休んでください🌙",
    emoji: "💙",
    color: "text-brand-blue",
  };
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const { status, message, emoji, color } = getScoreInfo(score);
  return (
    <div className="bg-brand-light-green/60 rounded-xl p-6 text-center shadow-inner">
      <p className="text-sm text-gray-600">今日のトータルスコア</p>
      <p className={`text-6xl font-bold font-rounded my-2 ${color}`}>{score}</p>
      <p className={`font-semibold ${color}`}>{emoji} {status}</p>
      <p className="mt-4 text-brand-dark/80 max-w-md mx-auto">{message}</p>
    </div>
  );
};
