import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { EmptyState } from "../components/EmptyState";
import { HeroCard } from "../components/HeroCard";
import { InfoIcon } from "../components/InfoIcon";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { getTripById } from "../data/trips";
import { formatDateRange, formatDateWithWeekday } from "../lib/format";
import type { Hotel } from "../types/trip";
import { NotFoundPage } from "./NotFoundPage";

type WeatherApiPayload = {
  current?: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

const getWeatherLabel = (code: number) => {
  if (code === 0) {
    return "快晴";
  }
  if (code === 1) {
    return "晴れ";
  }
  if (code === 2) {
    return "晴れ時々くもり";
  }
  if (code === 3) {
    return "くもり";
  }
  if (code === 45 || code === 48) {
    return "霧";
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return "霧雨";
  }
  if ([61, 63, 65, 66, 67].includes(code)) {
    return "雨";
  }
  if ([71, 73, 75, 77].includes(code)) {
    return "雪";
  }
  if ([80, 81, 82].includes(code)) {
    return "にわか雨";
  }
  if ([85, 86].includes(code)) {
    return "にわか雪";
  }
  if ([95, 96, 99].includes(code)) {
    return "雷雨";
  }
  return "天気情報";
};

const HotelWeatherSection = ({ hotel, tripDates }: { hotel: Hotel; tripDates: string[] }) => {
  const [weather, setWeather] = useState<WeatherApiPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotel.weatherLocation) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${hotel.weatherLocation?.latitude}&longitude=${hotel.weatherLocation?.longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=7`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("天気情報の取得に失敗しました。");
        }

        setWeather((await response.json()) as WeatherApiPayload);
      } catch (caughtError) {
        if ((caughtError as Error).name === "AbortError") {
          return;
        }

        setError("天気情報を取得できませんでした。");
      } finally {
        setIsLoading(false);
      }
    };

    void loadWeather();

    return () => controller.abort();
  }, [hotel.weatherLocation]);

  if (!hotel.weatherLocation) {
    return null;
  }

  const forecastDays =
    weather?.daily?.time
      .map((date, index) => ({
        date,
        weatherCode: weather.daily?.weather_code[index] ?? 0,
        max: weather.daily?.temperature_2m_max[index] ?? 0,
        min: weather.daily?.temperature_2m_min[index] ?? 0,
        precipitationProbability: weather.daily?.precipitation_probability_max[index] ?? 0,
      }))
      .filter((day) => tripDates.includes(day.date)) ?? [];

  return (
    <div className="stack-sm">
      <SectionHeader title="現地の天気" />
      {isLoading ? (
        <div className="note-card">天気情報を読み込み中です。</div>
      ) : error ? (
        <div className="note-card">{error}</div>
      ) : weather?.current ? (
        <div className="stack-sm">
          <div className="detail-grid">
            <div className="metric-card">
              <span>現在</span>
              <strong>{getWeatherLabel(weather.current.weather_code)}</strong>
            </div>
            <div className="metric-card">
              <span>気温</span>
              <strong>{weather.current.temperature_2m.toFixed(1)}°C</strong>
            </div>
            <div className="metric-card">
              <span>風速</span>
              <strong>{weather.current.wind_speed_10m.toFixed(1)} km/h</strong>
            </div>
            <div className="metric-card">
              <span>地点</span>
              <strong>{hotel.weatherLocation.label ?? "ホテル周辺"}</strong>
            </div>
          </div>
          {forecastDays.length ? (
            <div className="detail-grid">
              {forecastDays.map((day) => (
                <div className="weather-card" key={day.date}>
                  <p className="eyebrow">{formatDateWithWeekday(day.date)}</p>
                  <h3>{getWeatherLabel(day.weatherCode)}</h3>
                  <p>最高 {day.max.toFixed(1)}°C / 最低 {day.min.toFixed(1)}°C</p>
                  <p>降水確率 {day.precipitationProbability}%</p>
                </div>
              ))}
            </div>
          ) : null}
          <p className="muted-text">Open-Meteo の予報を表示しています。旅行日程に近い予報だけを抜き出しています。</p>
        </div>
      ) : (
        <div className="note-card">天気情報はまだありません。</div>
      )}
    </div>
  );
};

export const HotelPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  return (
    <AppShell
      title="ホテル"
      subtitle={trip.title}
      backTo={`/trips/${trip.id}`}
      backLabel="概要"
      bottomNav={<BottomNavigation tripId={trip.id} />}
    >
      <div className="stack-lg">
        <HeroCard
          eyebrow={trip.destination}
          title="宿泊情報"
          icon="hotel"
          backgroundImage="/hotel-lakeside-guide.png"
          meta={[
            { label: "宿数", value: `${trip.hotels.length}` },
            { label: "期間", value: formatDateRange(trip.startDate, trip.endDate) },
          ]}
        />

        <section className="stack-md">
          <SectionHeader title="宿泊情報" />
          {trip.hotels.length === 0 ? (
            <EmptyState
              title="まだホテル情報がありません"
              description="宿が確定したら、ホテルデータを追加していけます。"
            />
          ) : (
            <div className="stack-md">
              {trip.hotels.map((hotel) => (
                <StandardCard key={hotel.name}>
                  <div className="card-header">
                    <div>
                      <p className="eyebrow">Stay</p>
                      <h2>{hotel.name}</h2>
                    </div>
                    <div className="compact-metrics">
                      <div>
                        <span>チェックイン</span>
                        <strong>{hotel.checkIn ?? "-"}</strong>
                      </div>
                      <div>
                        <span>チェックアウト</span>
                        <strong>{hotel.checkOut ?? "-"}</strong>
                      </div>
                    </div>
                  </div>

                  <dl className="detail-list">
                    <div>
                      <dt>宿泊日</dt>
                      <dd>{hotel.stayDates.map(formatDateWithWeekday).join(" / ")}</dd>
                    </div>
                    {hotel.officialUrl ? (
                      <div>
                        <dt>公式URL</dt>
                        <dd>
                          <a className="text-link" href={hotel.officialUrl} target="_blank" rel="noreferrer">
                            {hotel.officialUrl}
                          </a>
                        </dd>
                      </div>
                    ) : null}
                    {hotel.planName ? (
                      <div>
                        <dt>プラン</dt>
                        <dd>{hotel.planName}</dd>
                      </div>
                    ) : null}
                    {hotel.roomType ? (
                      <div>
                        <dt>部屋タイプ</dt>
                        <dd>{hotel.roomType}</dd>
                      </div>
                    ) : null}
                    {hotel.priceNote ? (
                      <div>
                        <dt>料金メモ</dt>
                        <dd>{hotel.priceNote}</dd>
                      </div>
                    ) : null}
                    {hotel.address ? (
                      <div>
                        <dt>住所</dt>
                        <dd>{hotel.address}</dd>
                      </div>
                    ) : null}
                    {hotel.phone ? (
                      <div>
                        <dt>電話</dt>
                        <dd>{hotel.phone}</dd>
                      </div>
                    ) : null}
                    {hotel.bookingName ? (
                      <div>
                        <dt>予約者</dt>
                        <dd>{hotel.bookingName}</dd>
                      </div>
                    ) : null}
                    {hotel.parkingMemo ? (
                      <div>
                        <dt>駐車場</dt>
                        <dd>{hotel.parkingMemo}</dd>
                      </div>
                    ) : null}
                    {hotel.memo ? (
                      <div>
                        <dt>メモ</dt>
                        <dd>{hotel.memo}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <HotelWeatherSection hotel={hotel} tripDates={[trip.startDate, trip.endDate]} />

                  {hotel.rooms?.length ? (
                    <div className="stack-sm">
                      <SectionHeader title="部屋割り" />
                      <div className="detail-grid">
                        {hotel.rooms.map((room) => (
                          <div className="room-card" key={room.name}>
                            <p className="eyebrow">{room.name}</p>
                            <strong>{room.members.join(" / ")}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {hotel.accessNotes?.length ? (
                    <div className="stack-sm">
                      <SectionHeader title="アクセス" />
                      <div className="stack-xs">
                        {hotel.accessNotes.map((note) => (
                          <div className="note-card" key={note}>
                            <span className="note-card__icon" aria-hidden="true">
                              <InfoIcon name="route" className="note-card__icon-svg" />
                            </span>
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {hotel.highlights?.length ? (
                    <div className="stack-sm">
                      <SectionHeader title="あると助かる情報" />
                      <div className="stack-sm">
                        {hotel.highlights.map((spot) => (
                          <div className="facility-card" key={spot.name}>
                            <div className="stack-xs">
                              <div className="inline-cluster facility-card__header">
                                {spot.icon ? (
                                  <span className="icon-chip" aria-hidden="true">
                                    <InfoIcon name={spot.icon} className="icon-chip__icon" />
                                  </span>
                                ) : null}
                                <p className="eyebrow">Hotel</p>
                              </div>
                              <h3>{spot.name}</h3>
                              {spot.description ? <p>{spot.description}</p> : null}
                            </div>
                            <dl className="detail-list">
                              {spot.details?.length
                                ? spot.details.map((detail) => (
                                    <div key={detail}>
                                      <dt>情報</dt>
                                      <dd>{detail}</dd>
                                    </div>
                                  ))
                                : null}
                              {spot.note ? (
                                <div>
                                  <dt>メモ</dt>
                                  <dd>{spot.note}</dd>
                                </div>
                              ) : null}
                            </dl>
                            {spot.url ? (
                              <a className="button button--ghost" href={spot.url} target="_blank" rel="noreferrer">
                                詳細を見る
                              </a>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {hotel.links?.length ? (
                    <div className="inline-cluster">
                      {hotel.links.map((link) => (
                        <a
                          className="button button--secondary"
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          key={link.label}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}

                  <div className="inline-cluster">
                    {hotel.mapUrl ? (
                      <a className="button button--secondary" href={hotel.mapUrl} target="_blank" rel="noreferrer">
                        地図を見る
                      </a>
                    ) : null}
                    {hotel.officialUrl ? (
                      <a
                        className="button button--ghost"
                        href={hotel.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        公式サイト
                      </a>
                    ) : null}
                  </div>
                </StandardCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
};
