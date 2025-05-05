import { useCallback, useState } from "react";
import TipTapEditor from "./tiptap";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { useSmartContract } from "@/hooks/useSmartContract";
import { toast } from "sonner";
import { uploadFileToIPFS } from "@/lib/pinata";
import { useNavigate, useParams } from "react-router-dom";

const FormSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createSubmission } = useSmartContract();
  const [content, setContent] = useState<string>(
    "<p>Write your submissions..</p>"
  );

  const handleSubmit = useCallback(() => {
    const sendTx = async (cid: string) => {
      toast.promise(createSubmission(Number(id), cid), {
        loading: "Creating submission...",
        success: async (res) => {
            if (res) {
            navigate(0);
            
            return {
              message: "Submission created successfully!",
              type: "success",
            }; 
            }
          return { message: "Failed to create submission", type: "error" };
        },
        error: (err) => {
          console.log(err);
          return `Error creating submission: ${err.message}`;
        },
      });
    };
    const file = new File(
      [JSON.stringify({ content: content })],
      "submission.json",
      {
        type: "application/json",
      }
    );
    toast.promise(uploadFileToIPFS(file), {
      loading: "Uploading content to IPFS...",
      success: async (res) => {
        const cid = res.data.cid;
        sendTx(cid);
        return `File uploaded successfully!`;
      },
      error: (err) => {
        console.log(err);
        return `Error uploading file: ${err.message}`;
      },
    });
  }, [content, createSubmission, id, navigate]);
  return (
    <>
      <TipTapEditor
        maxHeight={200}
        customContent={content}
        onChange={(html) => setContent(html)}
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="mb-4"
        onClick={handleSubmit}
      >
        <Button className="text-sm" onClick={() => console.log("Submit")}>
          Submit
        </Button>
      </motion.button>
    </>
  );
};
export default FormSubmission;
