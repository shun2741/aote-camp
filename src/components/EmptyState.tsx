type EmptyStateProps = {
  title: string;
  description: string;
};

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="empty-state">
    <p className="empty-state__title">{title}</p>
    <p className="empty-state__description">{description}</p>
  </div>
);
