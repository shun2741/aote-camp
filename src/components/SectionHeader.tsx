type SectionHeaderProps = {
  title: string;
  description?: string;
};

export const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <div className="section-header">
    <div className="section-header__bar" />
    <div>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  </div>
);
