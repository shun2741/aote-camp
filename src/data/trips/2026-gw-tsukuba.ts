import type { Trip } from "../../types/trip";

export const tsukubaGw2026Trip: Trip = {
  id: "2026-gw-tsukuba",
  title: "2026GW テニス合宿",
  destination: "ホテルレイクサイドつくば",
  startDate: "2026-05-04",
  endDate: "2026-05-05",
  status: "planning",
  members: ["福田", "信田", "剛", "高橋", "周平", "舟田", "翔悟"],
  summary:
    "ゴールデンウィークの1泊2日テニス合宿。テニスを軸に、空き時間のゴルフ練習場と夜の麻雀までホテル内でまとめて回す予定。",
  schedule: [
    {
      date: "2026-05-04",
      label: "1日目",
      events: [
        {
          time: "13:00",
          title: "現地集合",
          location: "ホテルレイクサイドつくば",
          memo: "着いた人からフロント位置とコート周りを確認。",
          important: true,
        },
        {
          time: "13:00",
          title: "テニス",
          location: "ホテル敷地内 テニスコート",
          memo: "17:00までプレー。",
          important: true,
        },
        {
          time: "15:00",
          title: "チェックイン目安",
          location: "フロント",
          memo: "代表者対応。遅れる場合はホテルへ連絡。",
        },
        {
          title: "空き時間でゴルフ練習場",
          location: "ホテル敷地内 ゴルフ練習場",
          memo: "館内設備として利用可。天候次第で調整。",
        },
        {
          time: "18:00",
          title: "夕食",
          location: "館内レストラン または 宴会プラン",
          memo: "予約プランは夕朝食付き。",
        },
        {
          time: "20:30",
          title: "麻雀ルーム",
          location: "館内 麻雀室",
          memo: "夜のメインイベント。",
          important: true,
        },
      ],
    },
    {
      date: "2026-05-05",
      label: "2日目",
      events: [
        {
          time: "08:00",
          title: "朝食",
          location: "館内レストラン",
          memo: "朝食付きプラン前提。",
        },
        {
          time: "09:45",
          title: "チェックアウト",
          location: "フロント",
          memo: "チェックアウト後にコートへ移動。",
        },
        {
          time: "10:00",
          title: "テニス",
          location: "ホテル敷地内 テニスコート",
          memo: "12:00まで。",
          important: true,
        },
        {
          time: "12:15",
          title: "昼ごはん",
          location: "周辺のお店へ移動",
          memo: "下のホテル情報ページに候補を掲載。",
        },
        {
          time: "13:30",
          title: "解散",
          location: "現地または昼食後",
          important: true,
        },
      ],
    },
  ],
  hotels: [
    {
      name: "ホテルレイクサイドつくば",
      stayDates: ["2026-05-04"],
      checkIn: "15:00",
      checkOut: "10:00",
      address: "〒300-1273 茨城県つくば市下岩崎708-1",
      phone: "029-876-5050",
      mapUrl: "https://maps.google.com/?q=%E3%83%9B%E3%83%86%E3%83%AB%E3%83%AC%E3%82%A4%E3%82%AF%E3%82%B5%E3%82%A4%E3%83%89%E3%81%A4%E3%81%8F%E3%81%B0",
      officialUrl: "https://www.lakeside-tsukuba.jp/",
      planName: "【茨城ブランド♪】味麗豚すき焼き＆お刺身5点盛り和会席プラン",
      roomType: "和室14畳（牛久沼側・禁煙）",
      priceNote: "合計124,260円（税込・サービス料込） / 大人7名 / 1部屋",
      rooms: [
        {
          name: "和室14畳 1部屋",
          members: ["福田", "信田", "剛", "高橋", "周平", "舟田", "翔悟"],
        },
      ],
      accessNotes: [
        "車なら常磐道 谷田部IC、または圏央道 つくば牛久IC からのアクセスが便利。",
        "電車組はJR常磐線 龍ケ崎市駅、または TX みらい平駅 から車移動。",
        "宿泊者は龍ケ崎市駅・みらい平駅から無料送迎あり。事前予約制で、最終は17:30。",
        "ホテルにはテニスコート、ゴルフ練習場、麻雀室がある。",
      ],
      links: [
        {
          label: "ホテル案内・アクセス",
          url: "https://www.lakeside-tsukuba.jp/guide/",
        },
        {
          label: "レストラン月のほとり",
          url: "https://www.lakeside-tsukuba.jp/restaurant/",
        },
      ],
      nearbyFood: [
        {
          name: "レストラン 月のほとり",
          description: "ホテル館内。夕食を館内でまとめたいとき向け。",
          hours: "17:30〜20:00（L.O.19:30）",
          note: "現在はディナー営業のみ。ランチは休業中。",
          url: "https://www.lakeside-tsukuba.jp/restaurant/",
        },
        {
          name: "からあげ処 月曜から",
          description: "龍ケ崎方面で寄りやすいランチ候補。唐揚げ中心で人数が多くても入りやすい。",
          address: "茨城県龍ケ崎市馴馬町2840番地",
          hours: "ランチ 月〜金 11:30〜14:30（L.O.） / 祝日時営業",
          note: "5月5日（火・祝）でもランチ営業表記あり。",
          url: "https://karaagedokoro.com/",
        },
        {
          name: "レストラン kikyo（湯舞音 龍ケ崎店）",
          description: "定食、丼、麺類が多く、解散前に好みが割れても選びやすい。",
          hours: "平日 11:00〜22:00 / 土日祝 11:00〜23:00",
          note: "15:00〜17:00はアイドルタイム。レストラン利用のみでも入店可。",
          url: "https://yubune-ryugasaki.jp/meal/detail_1.html",
        },
      ],
      memo:
        "夜は館内の麻雀室を使う想定。昼ごはん候補は火曜定休の店も多いので、5月5日（火）は営業日を要確認で動く。",
    },
  ],
  expenses: [],
};
