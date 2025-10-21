import Link from "next/link";

interface NavigationItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  category: string;
}

interface NavigationCardProps {
  item: NavigationItem;
  hasAccess: boolean;
}

export default function NavigationCard({ item, hasAccess }: NavigationCardProps) {
  const isComingSoon = !item.link || item.link.trim() === "";

  return (
    <div
      className={`py-5 px-4 rounded-xl shadow transition space-y-2 ${
        hasAccess
          ? "bg-[#008641] text-white hover:shadow-lg"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
      }`}
    >
      <div className="text-3xl">{item.icon}</div>
      <h3 className="font-semibold text-lg">{item.title}</h3>
      <p className="text-sm opacity-90">{item.description}</p>

      {isComingSoon ? (
        <div
          className={`block w-full text-center mt-3 py-2 rounded-md ${
            hasAccess
              ? "bg-[rgba(255,255,255,0.2)]"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          Coming Soon
        </div>
      ) : hasAccess ? (
        <Link
          href={item.link}
          className="block w-full text-center mt-3 bg-[rgba(255,255,255,0.2)] py-2 rounded-md hover:bg-[rgba(255,255,255,0.3)] transition"
        >
          Available Now
        </Link>
      ) : (
        <div className="block w-full text-center mt-3 bg-gray-300 py-2 rounded-md text-gray-600">
          No Access
        </div>
      )}
    </div>
  );
}
