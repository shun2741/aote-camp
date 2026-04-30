import type { Trip } from "../../types/trip";

export const hokkaido2027Trip: Trip = {
  id: "2027-hokkaido",
  title: "2027 Hokkaido Ride",
  destination: "北海道・ニセコ",
  startDate: "2027-01-29",
  endDate: "2027-01-31",
  status: "planning",
  members: ["修", "拓海", "亮", "健太", "遼"],
  summary:
    "スノーボード中心の冬旅。滑る時間を最大化するため、移動と宿の動線を先に固めている段階。",
  schedule: [
    {
      date: "2027-01-29",
      label: "1日目",
      events: [
        {
          time: "07:30",
          title: "羽田空港集合",
          location: "羽田空港",
          important: true,
        },
        {
          time: "11:30",
          title: "新千歳空港到着",
          location: "新千歳空港",
        },
        {
          time: "14:30",
          title: "宿チェックイン",
          location: "ニセコエリア",
          memo: "レンタカー受け取り後に直行予定。",
        },
      ],
    },
    {
      date: "2027-01-30",
      label: "2日目",
      events: [
        {
          time: "09:00",
          title: "ゲレンデ集合",
          location: "ニセコ東山エリア",
          important: true,
        },
        {
          time: "18:30",
          title: "温泉と夜ごはん",
          location: "宿周辺",
        },
      ],
    },
    {
      date: "2027-01-31",
      label: "3日目",
      events: [
        {
          time: "10:00",
          title: "チェックアウト",
          location: "宿",
        },
        {
          time: "16:00",
          title: "新千歳空港出発",
          location: "新千歳空港",
        },
      ],
    },
  ],
  hotels: [
    {
      name: "Niseko Base Lodge",
      stayDates: ["2027-01-29", "2027-01-30"],
      checkIn: "15:00",
      checkOut: "10:00",
      address: "北海道虻田郡ニセコエリア",
      mapUrl: "https://maps.google.com/",
      officialUrl: "https://example.com/niseko",
      bookingName: "修",
      rooms: [
        {
          name: "Main Cabin",
          members: ["修", "拓海", "亮"],
        },
        {
          name: "Slope Side Twin",
          members: ["健太", "遼"],
        },
      ],
      parkingMemo: "台数制限あり。レンタカー確定後に宿へ連絡。",
      memo: "宿代は未確定。確定後に経費を追加する。",
    },
  ],
  expenses: [],
};
