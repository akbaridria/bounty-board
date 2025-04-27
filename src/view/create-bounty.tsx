import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const CreateBounty = () => {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <div className="p-4">
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
        <div className="text-lg font-semibold mb-4">Create Bounty</div>
        <div className="border rounded-lg p-4">{/* create form */}</div>
      </div>
    </PageWrapper>
  );
};

export default CreateBounty;
