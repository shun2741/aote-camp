import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { EmptyState } from "../components/EmptyState";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { getTripById } from "../data/trips";
import { formatDateRange, formatDateWithWeekday } from "../lib/format";
import { NotFoundPage } from "./NotFoundPage";

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
          description="チェックイン、部屋割り、アクセス情報をその場で開けるように整理。"
          meta={[
            { label: "宿数", value: `${trip.hotels.length}` },
            { label: "期間", value: formatDateRange(trip.startDate, trip.endDate) },
          ]}
        />

        <section className="stack-md">
          <SectionHeader
            title="宿泊情報"
            description="予約番号のような機微情報は載せず、必要な情報だけをまとめています。"
          />
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
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {hotel.highlights?.length ? (
                    <div className="stack-sm">
                      <SectionHeader
                        title="あると助かる情報"
                        description="現地で迷いそうな設備情報だけを抜き出しています。"
                      />
                      <div className="stack-sm">
                        {hotel.highlights.map((spot) => (
                          <div className="facility-card" key={spot.name}>
                            <div className="stack-xs">
                              <div className="inline-cluster">
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
