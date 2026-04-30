import type { Trip } from "../../types/trip";

export const nagano2025Trip: Trip = {
  id: "2025-nagano",
  title: "2025 Nagano Camp",
  destination: "長野・白馬",
  startDate: "2025-02-08",
  endDate: "2025-02-10",
  status: "completed",
  members: ["修", "拓海", "亮", "健太", "遼"],
  summary:
    "雪山メインの白馬旅。移動と宿はコンパクトで、滑る時間を優先したショートトリップ。",
  schedule: [
    {
      date: "2025-02-08",
      label: "1日目",
      events: [
        {
          time: "06:30",
          title: "都内出発",
          location: "新宿集合",
          transport: "車",
        },
        {
          time: "12:00",
          title: "白馬到着",
          location: "白馬村",
        },
      ],
    },
    {
      date: "2025-02-09",
      label: "2日目",
      events: [
        {
          time: "09:00",
          title: "ゲレンデへ",
          location: "白馬岩岳",
        },
      ],
    },
    {
      date: "2025-02-10",
      label: "3日目",
      events: [
        {
          time: "10:00",
          title: "チェックアウト",
          location: "ロッジ",
        },
      ],
    },
  ],
  hotels: [
    {
      name: "Hakuba Ridge Lodge",
      stayDates: ["2025-02-08", "2025-02-09"],
      checkIn: "15:00",
      checkOut: "10:00",
      address: "長野県北安曇郡白馬村",
      bookingName: "拓海",
      memo: "来年の宿選びの比較用メモとして残している。",
    },
  ],
  expenses: [
    {
      title: "宿代",
      amount: 68000,
      paidBy: "拓海",
      participants: ["修", "拓海", "亮", "健太", "遼"],
      category: "hotel",
    },
    {
      title: "高速代",
      amount: 14200,
      paidBy: "修",
      participants: ["修", "拓海", "亮", "健太", "遼"],
      category: "transport",
    },
  ],
};
