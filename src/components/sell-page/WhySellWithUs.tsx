import React from "react";

// Updated image URL as requested
const heroImageUrl = "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/SellPage/sell_page_hand_shake.webp";

const steps = [
  {
    title: "Tell Us About Your Vehicle",
    description:
      "Share your vehicle’s make, model, condition, and upload recent photos. Accurate listings attract serious buyers and help you get the best offers.",
    icon: (
  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF0E7] border border-[#ffd1b0]">
    {/* Car icon */}
    <svg width="24" height="24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="6" rx="3" />
      <path d="M5 17v2a2 2 0 1 0 4 0v-2" />
      <path d="M15 17v2a2 2 0 1 0 4 0v-2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  </span>
)
,
  },
  {
    title: "Verified & Listed Faster",
    description:
      "Our team reviews your information to ensure accuracy. Once posted, your car and bike is listed on the platform  and shared with verified buyers and dealer partners.",
    icon: (
  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF0E7] border border-[#ffd1b0]">
    {/* Shield check icon */}
    <svg width="24" height="24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  </span>
)
,
  },
  {
    title: "Connect with Verified Buyers",
    description:
      "You’ll hear only from verified, interested buyers. Chat with them directly to negotiate the best deal — no middlemen, no pressure.",
    icon: (
  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF0E7] border border-[#ffd1b0]">
    {/* Chat icon */}
    <svg width="24" height="24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  </span>
)
,
  },
  {
    title: "Sell with Confidence, No Commission",
    description:
      "Once you agree on a price, finalize the sale securely. VahaanXchange charges zero commission, so the full payment goes directly to you.",
    icon: (
  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF0E7] border border-[#ffd1b0]">
    {/* Money icon */}
    <svg width="24" height="24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8m0-8a4 4 0 0 1 0 8" />
    </svg>
  </span>
)
,
  },
];

const WhySellWithUs: React.FC = () => {
  return (
    <section className="py-20 px-5 lg-px-none bg-[#F5F8FB] dark:bg-[#000000]">
      <div className="container max-w-7xl mx-auto px-2 md:px-6">
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
          {/* Steps and heading */}
          <div className="md:w-2/3 w-full">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[#222F38] dark:text-[#ffffff] tracking-tight">
              How VahaanXchange Works?
            </h2>
            <ol className="relative border-l-2 border-dashed border-[#ffe1c5] pl-6 space-y-8">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-start group">
                  <div className="absolute -left-6">
                    {step.icon}
                  </div>
                  <div className="ml-6">
                    <h3 className="font-semibold text-lg md:text-xl text-[#222F38] dark:text-[#ffffff] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[#50596B] text-base md:text-[16px] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <p className="text-lg font-semibold text-[#2B3640]">
                With VahaanXchange, selling your car is not just easier—<br className="hidden md:block" />it’s smarter.
              </p>
            </div>
          </div>
          {/* Sidebar image - now updated */}
          <div className="mx-auto md:mx-0 md:w-1/3 flex-shrink-0 flex justify-center">
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white w-[300px] h-[340px] flex items-center justify-center">
              <img
                src={heroImageUrl}
                alt="Modern flat car illustration - Why VahaanXchange"
                className="w-full h-full object-contain"
                style={{ minHeight: 260 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySellWithUs;
