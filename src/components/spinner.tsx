import { motion } from "motion/react";

const Spinner = () => {
  return (
    <motion.div
      className="w-[32px] h-[32px] rounded-full border-4 border-divider border-t-[#ff0088] will-change-transform"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export default Spinner;
