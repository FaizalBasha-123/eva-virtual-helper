
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  value: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ 
  question, 
  answer, 
  value 
}) => (
  <AccordionItem value={value} className="border-b border-gray-200 dark:border-gray-800">
    <AccordionTrigger className="text-left font-medium py-6 text-base">
      {question}
    </AccordionTrigger>
    <AccordionContent className="text-muted-foreground pb-6">
      {answer}
    </AccordionContent>
  </AccordionItem>
);
const FAQSection: React.FC = () => {
const faqs = [
  {
    question: "Do I need to pay a commission or go through a middleman?",
    answer: "No. VahaanXchange charges a single, transparent fee—no brokers, no commissions, no hidden charges."
  },
  {
    question: "What is the AI-powered pricing tool, and how does it help me?",
    answer: "The AI pricing tool provides a reliable, data-driven estimate of your vehicle’s market value to help both buyers and sellers make informed decisions."
  },
  {
    question: "How does VahaanXchange ensure listings are genuine?",
    answer: "All listings go through manual RC and Aadhaar verification to ensure authenticity and reduce spam."
  },
  {
    question: "Does VahaanXchange buy or sell vehicles directly?",
    answer: "No. VahaanXchange does not manipulate prices or participate in deals. It's a pure matchmaking platform connecting buyers and sellers."
  },
  {
    question: "What is the current fee for listing a vehicle?",
    answer: "The current introductory listing fee is Rs.199. This is subject to revision as platform traffic and trust grow."
  },
  {
    question: "Will I get serious buyers through the platform?",
    answer: "Yes. Because users pay to list, the platform attracts high-intent buyers and sellers, leading to better conversions."
  },
  {
    question: "Is the Rs.199 listing fee worth it?",
    answer: "Absolutely. For just Rs.199, you get verified exposure and access to a trusted network of buyers and sellers."
  }
];

  return (
    <section className="py-16 px-4 bg-white dark:bg-black">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-10">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                value={`item-${index}`}
              />
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
