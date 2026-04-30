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

export const SchedulePage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  return (
    <AppShell
      title="Schedule"
      subtitle={trip.title}
      backTo={`/trips/${trip.id}`}
      backLabel="Trip"
      bottomNav={<BottomNavigation tripId={trip.id} />}
    >
      <div className="stack-lg">
        <HeroCard
          eyebrow={trip.destination}
          title="日別スケジュール"
          description="集合、移動、食事、麻雀まで、スマホで追いやすいタイムライン表示。"
          meta={[
            { label: "Days", value: `${trip.schedule.length}` },
            { label: "期間", value: formatDateRange(trip.startDate, trip.endDate) },
          ]}
        />

        <section className="stack-md">
          <SectionHeader
            title="Timeline"
            description="時刻未定のイベントも同じ列に並べられる構成。"
          />
          {trip.schedule.length === 0 ? (
            <EmptyState
              title="まだスケジュールが登録されていません"
              description="予定が固まったら、旅行データに追記していけます。"
            />
          ) : (
            trip.schedule.map((day) => (
              <div className="stack-sm" key={day.date}>
                <div className="day-heading">
                  <div>
                    <p>{day.label}</p>
                    <h2>{formatDateWithWeekday(day.date)}</h2>
                  </div>
                </div>
                <div className="timeline">
                  {day.events.map((event) => (
                    <div className="timeline-item" key={`${day.date}-${event.title}-${event.time ?? "tbd"}`}>
                      <div className={`timeline-item__time ${event.important ? "timeline-item__time--important" : ""}`}>
                        {event.time ?? "TBD"}
                      </div>
                      <StandardCard className="timeline-item__card">
                        <h3>{event.title}</h3>
                        {event.location ? <p className="timeline-item__location">{event.location}</p> : null}
                        {event.transport ? (
                          <p className="timeline-item__meta">移動: {event.transport}</p>
                        ) : null}
                        {event.memo ? <p className="timeline-item__note">{event.memo}</p> : null}
                        {event.url ? (
                          <a className="text-link" href={event.url} target="_blank" rel="noreferrer">
                            リンクを開く
                          </a>
                        ) : null}
                      </StandardCard>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </AppShell>
  );
};
