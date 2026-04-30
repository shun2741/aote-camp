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
      title="Hotel"
      subtitle={trip.title}
      backTo={`/trips/${trip.id}`}
      backLabel="Trip"
      bottomNav={<BottomNavigation tripId={trip.id} />}
    >
      <div className="stack-lg">
        <HeroCard
          eyebrow={trip.destination}
          title="宿泊情報"
          description="チェックイン、部屋割り、アクセス情報をその場で開けるように整理。"
          meta={[
            { label: "Hotels", value: `${trip.hotels.length}` },
            { label: "期間", value: formatDateRange(trip.startDate, trip.endDate) },
          ]}
        />

        <section className="stack-md">
          <SectionHeader
            title="Stay Details"
            description="予約番号のような機微情報は載せず、行動に必要な情報だけを表示。"
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
                        <span>Check In</span>
                        <strong>{hotel.checkIn ?? "-"}</strong>
                      </div>
                      <div>
                        <span>Check Out</span>
                        <strong>{hotel.checkOut ?? "-"}</strong>
                      </div>
                    </div>
                  </div>

                  <dl className="detail-list">
                    <div>
                      <dt>宿泊日</dt>
                      <dd>{hotel.stayDates.map(formatDateWithWeekday).join(" / ")}</dd>
                    </div>
                    {hotel.address ? (
                      <div>
                        <dt>住所</dt>
                        <dd>{hotel.address}</dd>
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
                      <SectionHeader title="Room Split" />
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

                  <div className="inline-cluster">
                    {hotel.mapUrl ? (
                      <a className="button button--secondary" href={hotel.mapUrl} target="_blank" rel="noreferrer">
                        Map
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
