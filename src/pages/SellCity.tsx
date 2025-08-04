import React from "react";
import { useParams, Link } from "react-router-dom";

// List of supported cities (keep lowercase for route matching)
const validCities = [
  "chennai",
  "tiruchirappalli",
  "coimbatore",
  "madurai",
  "bengaluru",
  "hyderabad",
];

// Utility to convert city slug to Title Case
function toTitleCase(str: string) {
  return str
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}

const SellCity: React.FC = () => {
  const { city } = useParams<{ city: string }>();

  if (!city || !validCities.includes(city)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center border">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            City not supported yet.
          </h2>
          <p className="mb-6">Please go back to the Sell page and select a supported city.</p>
          <Link
            to="/sell"
            className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold transition hover:bg-primary/90"
          >
            Go to Sell Page
          </Link>
        </div>
      </div>
    );
  }

  const cityDisplay = toTitleCase(city);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#f5f6fa] dark:bg-black/80">
      <div className="max-w-xl w-full bg-white dark:bg-black/90 rounded-2xl shadow-lg p-10 flex flex-col items-center border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Sell Your Vehicle in <span className="text-primary">{cityDisplay}</span>
        </h1>
        <p className="mb-4 text-muted-foreground text-lg">
          We’re available in <span className="font-semibold text-primary">{cityDisplay}</span>. Book your doorstep inspection today!
        </p>
        <ul className="mb-6 text-base text-gray-600 dark:text-gray-300 list-disc list-inside">
          <li>Doorstep inspection with zero hassle</li>
          <li>Transparent, instant quotes</li>
          <li>Instant payment on deal confirmation</li>
        </ul>
        <Link
          to="/sell"
          className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold transition hover:bg-primary/90 mt-2"
        >
          Book My Inspection
        </Link>
      </div>
    </div>
  );
};

export default SellCity;
