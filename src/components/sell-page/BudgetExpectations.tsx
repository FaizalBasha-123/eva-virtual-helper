
import React from "react";
import {
  BadgeDollarSign,
  ShieldCheck,
  Handshake,
  Clock,
  Truck,
  Users,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface ExpectationItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ExpectationItem: React.FC<ExpectationItemProps> = ({
  icon,
  title,
  description,
}) => (
  <Card className="p-6 hover:shadow-lg transition-shadow duration-200 h-full">
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </Card>
);

const BudgetExpectations: React.FC = () => {
  const expectations = [
    {
      icon: <BadgeDollarSign className="w-6 h-6" />,
      title: "Best Price Guarantee",
      description: "Get competitive pricing based on real-time market data analysis"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Free Inspection & Evaluation",
      description: "Zero upfront fees or hidden charges for initial evaluation"
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Instant Offer with No Middlemen",
      description: "Transparent process without agent commissions or hidden deductions"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Fast Payouts",
      description: "Quick transactions with same-day bank transfers or UPI payments"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Pickup from Doorstep",
      description: "Convenient vehicle pickup directly from your location"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Verified Buyer Network",
      description: "Your vehicle is shown only to trustworthy, verified buyers"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "RC Transfer Support",
      description: "Complete support for paperwork, including RC transfer process"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Insurance Check and Add-on Support",
      description: "Insurance validity check and assistance with additional benefits"
    }
  ];

  return (
    <section className="py-16 bg-[#F1F0FB] dark:bg-black/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Budget-Conscious Customers Expect
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {expectations.map((item, index) => (
            <ExpectationItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BudgetExpectations;
