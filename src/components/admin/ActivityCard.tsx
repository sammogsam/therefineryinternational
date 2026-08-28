interface ActivityCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ActivityCard({
  title,
  children,
}: ActivityCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-bold text-gray-900">
        {title}
      </h2>

      {children}

    </div>
  );
}