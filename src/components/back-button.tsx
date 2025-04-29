import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronLeftIcon } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="mb-4"
      onClick={() => navigate(-1)}
    >
      <Button className="flex items-center gap-1" variant="ghost">
        <ChevronLeftIcon />
        <div>Back</div>
      </Button>
    </motion.button>
  );
};

export default BackButton;
