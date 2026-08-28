import Image from "next/image";
import Link from "next/link";

type EventCardProps = {
  title: string;
  date: string;
  venue: string;
  status: "Published" | "Draft";
  image: string;
};

export default function EventCard({
  title,
  date,
  venue,
  status,
  image,
}: EventCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">

      <Image
        src={image}
        alt={title}
        width={600}
        height={350}
        className="h-52 w-full object-cover"
      />

      <div className="space-y-4 p-6">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {title}
            </h2>

            <p className="mt-2 text-gray-500">
              {date}
            </p>

            <p className="text-gray-500">
              {venue}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              status === "Published"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status}
          </span>

        </div>

        <div className="flex gap-3">

          <Link
            href="#"
            className="rounded-xl bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
          >
            Edit
          </Link>

          <button className="rounded-xl border border-red-300 px-4 py-2 text-red-500 transition hover:bg-red-50">
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}