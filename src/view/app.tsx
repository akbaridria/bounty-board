import Header from "@/components/header";
import ListBounties from "@/components/list-bounties";
import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <Header />
      <ListBounties />
      <div className="fixed bottom-4 right-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/create-bounty")}
        >
          <Button size="icon" className="rounded-full">
            <PlusIcon />
          </Button>
        </motion.button>
      </div>
    </PageWrapper>
  );
}

export default App;
