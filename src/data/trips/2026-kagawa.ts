import type { Trip } from "../../types/trip";

export const kagawa2026Trip: Trip = {
  id: "2026-kagawa",
  title: "2026 香川 Trip",
  destination: "香川・高松",
  startDate: "2026-02-21",
  endDate: "2026-02-23",
  status: "completed",
  members: ["修", "拓海", "亮", "健太"],
  summary:
    "うどん、港町ドライブ、夜の麻雀まで全部詰め込んだ3日間。移動はレンタカー中心で、観光とごはんを軽快に回る構成。",
  schedule: [
    {
      date: "2026-02-21",
      label: "1日目",
      events: [
        {
          time: "08:20",
          title: "羽田空港集合",
          location: "羽田空港 第1ターミナル",
          memo: "保安検査場前で合流。朝食は各自で済ませる。",
          important: true,
        },
        {
          time: "10:05",
          title: "高松空港到着",
          location: "高松空港",
          transport: "飛行機",
        },
        {
          time: "11:20",
          title: "レンタカー受け取り",
          location: "高松空港レンタカーターミナル",
          transport: "徒歩",
        },
        {
          time: "12:30",
          title: "昼うどん",
          location: "高松市内",
          memo: "初日の本命。回転が早いので先に並ぶ。",
          url: "https://maps.google.com/",
        },
        {
          time: "15:30",
          title: "ホテルチェックイン",
          location: "高松ベイサイドホテル",
          important: true,
        },
        {
          time: "19:00",
          title: "港エリアで夕食",
          location: "北浜アリー周辺",
          memo: "海沿いを散歩してから入店。",
        },
        {
          time: "22:00",
          title: "1半荘目スタート",
          location: "ホテルラウンジ",
          memo: "ルールは1・2の点5。",
        },
      ],
    },
    {
      date: "2026-02-22",
      label: "2日目",
      events: [
        {
          time: "09:30",
          title: "屋島方面へ移動",
          location: "ホテル出発",
          transport: "レンタカー",
        },
        {
          time: "10:20",
          title: "展望台で写真",
          location: "屋島山上",
          memo: "風が強いので上着必須。",
        },
        {
          time: "12:10",
          title: "骨付鳥ランチ",
          location: "高松中心部",
          important: true,
        },
        {
          time: "15:00",
          title: "カフェ休憩",
          location: "商店街エリア",
          memo: "ここで一度精算メモを確認。",
        },
        {
          time: "18:30",
          title: "夜ごはん",
          location: "瓦町エリア",
        },
        {
          time: "21:30",
          title: "2半荘目・3半荘目",
          location: "ホテルラウンジ",
          memo: "終わったらその場で結果を記録。",
        },
      ],
    },
    {
      date: "2026-02-23",
      label: "3日目",
      events: [
        {
          time: "09:00",
          title: "チェックアウト",
          location: "高松ベイサイドホテル",
          important: true,
        },
        {
          time: "10:00",
          title: "栗林公園を散歩",
          location: "栗林公園",
        },
        {
          time: "12:00",
          title: "最後のうどん",
          location: "空港方面",
          memo: "返却前に寄れる店を優先。",
        },
        {
          time: "14:00",
          title: "レンタカー返却",
          location: "高松空港",
          transport: "レンタカー",
        },
        {
          time: "16:20",
          title: "高松空港出発",
          location: "高松空港",
          transport: "飛行機",
        },
        {
          time: "17:45",
          title: "羽田着・解散",
          location: "羽田空港",
          important: true,
        },
      ],
    },
  ],
  hotels: [
    {
      name: "高松ベイサイドホテル",
      stayDates: ["2026-02-21", "2026-02-22"],
      checkIn: "15:00",
      checkOut: "10:00",
      address: "香川県高松市サンポートエリア",
      mapUrl: "https://maps.google.com/",
      officialUrl: "https://example.com/hotel",
      bookingName: "修",
      rooms: [
        {
          name: "Harbor Twin",
          members: ["修", "拓海"],
        },
        {
          name: "Night Session Twin",
          members: ["亮", "健太"],
        },
      ],
      parkingMemo: "立体駐車場あり。夜は満車になりやすいので夕方までに入庫。",
      memo: "予約番号は掲載しない。朝食会場は7:00から。",
    },
  ],
  expenses: [
    {
      title: "レンタカー代",
      amount: 36000,
      paidBy: "修",
      participants: ["修", "拓海", "亮", "健太"],
      category: "transport",
      memo: "3日間分",
    },
    {
      title: "ホテル代",
      amount: 52000,
      paidBy: "拓海",
      participants: ["修", "拓海", "亮", "健太"],
      category: "hotel",
      memo: "2泊4人",
    },
    {
      title: "昼うどん",
      amount: 8400,
      paidBy: "亮",
      participants: ["修", "拓海", "亮", "健太"],
      category: "food",
    },
    {
      title: "サービスエリア軽食",
      amount: 2400,
      paidBy: "健太",
      participants: ["修", "健太"],
      category: "food",
    },
    {
      title: "駐車場",
      amount: 1800,
      paidBy: "修",
      participants: ["修", "拓海", "亮", "健太"],
      category: "transport",
    },
    {
      title: "ガソリン代",
      amount: 6200,
      paidBy: "健太",
      participants: ["修", "拓海", "亮", "健太"],
      category: "transport",
    },
    {
      title: "展望台カフェ",
      amount: 3600,
      paidBy: "拓海",
      participants: ["修", "拓海", "亮"],
      category: "activity",
      memo: "健太は車で待機",
    },
  ],
  mahjong: {
    title: "2026 香川旅行 麻雀",
    rule: {
      rate: 0.5,
      uma: [20, 10, -10, -20],
      oka: 20,
      startPoint: 25000,
      returnPoint: 30000,
    },
    games: [
      {
        label: "1半荘目",
        results: [
          { name: "修", point: 42500 },
          { name: "拓海", point: 28000 },
          { name: "亮", point: 21000 },
          { name: "健太", point: 8500 },
        ],
      },
      {
        label: "2半荘目",
        results: [
          { name: "修", point: 18600 },
          { name: "拓海", point: 37700 },
          { name: "亮", point: 24000 },
          { name: "健太", point: 19700 },
        ],
      },
      {
        label: "3半荘目",
        results: [
          { name: "修", point: 30100 },
          { name: "拓海", point: 25500 },
          { name: "亮", point: 18000 },
          { name: "健太", point: 26400 },
        ],
      },
    ],
  },
};
