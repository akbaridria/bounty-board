"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSmartContract } from "@/hooks/useSmartContract";
import { useUpProvider } from "@/context/UpProvider";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { FormSchema } from "./constant";
import { toast } from "sonner";
import { getFileFromIPFS, uploadFileToIPFS } from "@/lib/pinata";
import { useNavigate, useParams } from "react-router-dom";
import TitleAndContentFields from "./components/title-and-content-fields";
import DeadlineFields from "./components/deadline-fields";
import PrizeFields from "./components/prize-fields";
import BountyTypeSelection from "./components/bounty-type-selection";
import { ethers } from "ethers";

interface FormBountyProps {
  mode: "create" | "edit";
}

const FormBounty: React.FC<FormBountyProps> = ({ mode }) => {
  const [defaultContent, setDefaultContent] = useState(undefined);
  const { id } = useParams();
  const { walletConnected } = useUpProvider();
  const { createBounty, getBountyDetailById, editBounty } = useSmartContract();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      totalWinners: 1,
      bountyType: 1,
    },
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const res = await getBountyDetailById(Number(id));
        if (res) {
          const dataContent = await getFileFromIPFS(res.cid);
          if (dataContent) {
            setDefaultContent(dataContent?.data?.content);
            form.setValue("title", dataContent.data.title);
            form.setValue("content", dataContent.data.content);
            form.setValue("deadline", new Date(Number(res.deadline) * 1000));
            form.setValue(
              "resultDeadline",
              new Date(Number(res.resultDeadline) * 1000)
            );
            form.setValue("minParticipants", Number(res.minParticipants));
            form.setValue("totalWinners", Number(res.totalWinners));
            form.setValue("bountyType", Number(res.bountyType));
            form.setValue(
              "prizes",
              res.prizes.map((prize: bigint) => ({
                value: Number(ethers.formatEther(prize)),
              }))
            );
          }
        }
      })();
    }
  }, [mode, id, getBountyDetailById, form]);

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "prizes",
  });

  const inputCount = form.watch("totalWinners");
  const bountyType = form.watch("bountyType");

  useEffect(() => {
    const currentValues = form.getValues().prizes || [];
    const newCount = Number(inputCount) || 0;
    const validCount = Math.max(1, Math.min(20, newCount));

    const newValues = Array(validCount)
      .fill(null)
      .map((_, i) => {
        return i < currentValues.length ? currentValues[i] : { value: 0 };
      });

    replace(newValues);
  }, [inputCount, replace, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const createTx = (_cid: string) => {
      toast.promise(
        createBounty(
          data.title,
          _cid,
          Math.floor(data.deadline.getTime() / 1000),
          Math.floor(data.resultDeadline.getTime() / 1000),
          data.minParticipants,
          data.totalWinners,
          data.prizes.map((prize) => prize.value),
          data.bountyType
        ),
        {
          loading: "Creating bounty...",
          success: (res) => {
            if (res) {
              navigate("/", { replace: true });
              return {
                message: "Bounty created successfully",
                type: "success",
              };
            }
            return { message: "Bounty creation failed", type: "error" };
          },
          error: (err) => {
            console.log(err);
            return `Error creating bounty: ${err.message}`;
          },
        }
      );
    };

    const editTx = (_cid: string) => {
      toast.promise(
        editBounty(
          Number(id),
          _cid,
          Math.floor(data.deadline.getTime() / 1000),
          Math.floor(data.resultDeadline.getTime() / 1000),
          data.minParticipants,
          data.totalWinners,
          data.prizes.map((prize) => prize.value),
        ),
        {
          loading: "Editing bounty...",
          success: (res) => {
            if (res) {
              navigate("/", { replace: true });
              return {
                message: "Bounty edited successfully",
                type: "success",
              };
            }
            return { message: "Bounty edited failed", type: "error" };
          },
          error: (err) => {
            console.log(err);
            return `Error editing bounty: ${err.message}`;
          },
        }
      );
    };

    const file = new File(
      [JSON.stringify({ title: data.title, content: data.content })],
      "bounty.json",
      {
        type: "application/json",
      }
    );
    toast.promise(uploadFileToIPFS(file), {
      loading: "Uploading content to IPFS...",
      success: (res) => {
        if (mode === "edit") {
          editTx(res.data.cid);
        }
        if (mode === "create") {
          createTx(res.data.cid);
        }
        return `File uploaded successfully!`;
      },
      error: (err) => {
        console.log(err);
        return `Error uploading file: ${err.message}`;
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="p-4 space-y-4">
          <TitleAndContentFields form={form} defaultContent={defaultContent} />
          <DeadlineFields form={form} />
        </div>
        <Separator orientation="horizontal" />
        <PrizeFields form={form} fields={fields} />
        <Separator orientation="horizontal" />
        <BountyTypeSelection form={form} bountyType={bountyType} mode={mode} />
        <Separator orientation="horizontal" />
        <div className="flex justify-end p-4">
          <Button type="submit" disabled={!walletConnected}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormBounty;
