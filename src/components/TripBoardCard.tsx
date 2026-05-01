type TripBoardMoment = {
  label: string;
  time?: string;
  detail?: string;
};

type TripBoardCardProps = {
  title: string;
  subtitle: string;
  note?: string;
  moments: TripBoardMoment[];
  stats?: Array<{ label: string; value: string }>;
};

export const TripBoardCard = ({
  title,
  subtitle,
  note,
  moments,
  stats = [],
}: TripBoardCardProps) => (
  <section className="trip-board-card">
    <div className="trip-board-card__poster">
      <div className="trip-board-card__badge">GW</div>
      <div className="trip-board-card__graphic">
        <span className="trip-board-card__ball trip-board-card__ball--mint" />
        <span className="trip-board-card__ball trip-board-card__ball--blue" />
        <span className="trip-board-card__racket" />
      </div>
      <p className="eyebrow">{subtitle}</p>
      <h2>{title}</h2>
      {note ? <p>{note}</p> : null}
    </div>

    <div className="trip-board-card__content">
      <div className="trip-board-card__moments">
        {moments.map((moment) => (
          <div className="trip-board-card__moment" key={`${moment.label}-${moment.time ?? "na"}`}>
            <span className="trip-board-card__moment-time">{moment.time ?? "予定"}</span>
            <div>
              <strong>{moment.label}</strong>
              {moment.detail ? <p>{moment.detail}</p> : null}
            </div>
          </div>
        ))}
      </div>

      {stats.length ? (
        <div className="trip-board-card__stats">
          {stats.map((stat) => (
            <div className="trip-board-card__stat" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  </section>
);
