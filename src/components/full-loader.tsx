"use client";

import { motion } from "motion/react";

const FullLoader = () => {
  return (
    <div className="flex h-screen w-screen justify-center items-center p-10 rounded-lg">
      <motion.div
        className="w-[32px] h-[32px] rounded-full border-4 border-divider border-t-[#ff0088] will-change-transform"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default FullLoader;
