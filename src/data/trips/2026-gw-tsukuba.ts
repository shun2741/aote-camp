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
      weatherLocation: {
        latitude: 36.1,
        longitude: 140.125,
        label: "つくば市周辺",
      },
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
      parkingMemo:
        "駐車場は合計240台で無料。ホテル正面駐車場と、道路向かいの砂利駐車場あり。宿泊者専用駐車場は到着後ホテルへ連絡。",
      accessNotes: [
        "車なら常磐道 谷田部IC、または圏央道 つくば牛久IC からのアクセスが便利。",
        "電車組はJR常磐線 龍ケ崎市駅、または TX みらい平駅 から車移動。",
        "宿泊者は龍ケ崎市駅・みらい平駅から無料送迎あり。事前予約制で、最終は17:30。",
        "建物内はフロントとレストランが1F、温泉が2FとB1、麻雀室はB1。",
        "テニスコートとゴルフ練習場は建物外のスポーツエリア。到着時はゴルフ場の大きなネットが目印。",
      ],
      links: [
        {
          label: "ホテル案内・アクセス",
          url: "https://www.lakeside-tsukuba.jp/guide/",
        },
        {
          label: "スポーツ施設案内",
          url: "https://www.lakeside-tsukuba.jp/sports/",
        },
        {
          label: "天然温泉案内",
          url: "https://www.lakeside-tsukuba.jp/touch/bath/",
        },
      ],
      highlights: [
        {
          name: "テニスコート",
          icon: "tennis",
          description: "屋外オムニコート6面。宿泊者は電話予約で確保。",
          details: [
            "営業時間は9:00〜17:00",
            "宿泊者料金は土日祝 1面1時間 880円",
            "宿泊利用は6か月前の月初から予約可",
          ],
          note: "ナイター設備はなし。今回の予定時間と営業時間は一致。",
          url: "https://www.lakeside-tsukuba.jp/sports/tennis.php",
        },
        {
          name: "ゴルフ練習場",
          icon: "golf",
          description: "屋外26打席。空き時間に入れやすいサブプラン。",
          details: [
            "営業時間は9:00〜20:00",
            "宿泊者は1名につき50球サービスコイン1枚あり",
            "無料貸クラブあり",
          ],
          note: "レストラン隣の練習場なので、夕食前後にも動きやすい。",
          url: "https://www.lakeside-tsukuba.jp/sports/golf.php",
        },
        {
          name: "麻雀室",
          icon: "mahjong",
          description: "夜のメイン。地下1階に全自動麻雀卓を5卓設置。",
          details: [
            "利用時間は13:00〜翌12:00",
            "料金は1卓 6,600円",
            "宿泊者限定。利用申込はフロントへ",
          ],
          note: "到着後の早い段階でフロントに空き状況を確認した方が安全。",
          url: "https://www.lakeside-tsukuba.jp/sports/",
        },
        {
          name: "天然温泉",
          icon: "bath",
          description: "テニス後に使いやすい館内温泉。",
          details: [
            "2F大浴場 11:00〜21:00（最終受付20:00）",
            "B1露天風呂 12:00〜21:00（最終受付20:00）",
            "シャンプー、リンス、ボディーソープ完備",
          ],
          note: "B1に露天風呂、2Fに展望大浴場。どちらも夜に使える。",
          url: "https://www.lakeside-tsukuba.jp/touch/bath/",
        },
      ],
      memo:
        "和室14畳は2F。麻雀室はB1なので、夜の移動はエレベーターでまとまって降りるとスムーズ。",
    },
  ],
  expenses: [],
};
