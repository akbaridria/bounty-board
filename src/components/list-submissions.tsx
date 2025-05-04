import { useSmartContract } from "@/hooks/useSmartContract";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Submission from "./submission";
import { IBountySubmission } from "@/hooks/type";

const ListSubmissions = () => {
  const { id } = useParams();
  const [listSubmission, setListSubmission] = useState<IBountySubmission[]>([]);

  const { getBountySubmissionById } = useSmartContract();

  useEffect(() => {
    if (id) {
      (async () => {
        const dataSubmissions = await getBountySubmissionById(Number(id));
        setListSubmission(dataSubmissions || []);
      })();
    }
  }, [getBountySubmissionById, id]);
  return (
    <>
      {listSubmission.map((submission, index) => (
        <Submission key={index} data={submission} />
      ))}
    </>
  );
};

export default ListSubmissions;
