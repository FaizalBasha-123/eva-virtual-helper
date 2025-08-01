
import React from "react";
import { motion } from "framer-motion";
import { RotateCw, Clock, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: <RotateCw className="h-12 w-12 text-primary" />,
    title: "Instant Price Quote",
    description: "Our AI-powered pricing engine analyzes market data to give you the best possible price for your car instantly.",
  },
  {
    icon: <Clock className="h-12 w-12 text-primary" />,
    title: "Hassle-Free Process",
    description: "Sell your car in just 3 simple steps. No more endless negotiations or paperwork nightmares.",
  },
  {
    icon: <ShieldCheck className="h-12 w-12 text-primary" />,
    title: "100% Trusted & Secure",
    description: "All our buyers are verified, and our secure transaction process ensures your safety and peace of mind.",
  },
];

const BenefitsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-2">Why Sell With Us?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've streamlined the car selling process to make it quick, easy, and rewarding for you
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-card hover:bg-card/80 p-8 rounded-xl border border-border/40 shadow-sm hover-scale"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-6">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-primary/5 rounded-xl p-8 max-w-3xl mx-auto border border-primary/10"
        >
          <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
          <p className="text-muted-foreground mb-0">
            It only takes a few minutes to get a quote and start the selling process.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
