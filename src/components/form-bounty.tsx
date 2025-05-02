"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Tiptap from "./tiptap";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn, getOrdinal, getOrdinalParts } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, LockIcon, LockOpenIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
// import { useSmartContract } from "@/hooks/useSmartContract";
// import { useUpProvider } from "@/context/UpProvider";
// import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { useEffect } from "react";

const BOUNTY_TYPES = [
  {
    title: "Flexible Bounty (Editable)",
    description: [
      "Allows creators to modify bounty details (prizes, deadlines, requirements) after creation",
      "Ideal for evolving projects where parameters may need adjustments",
      "Maintains transparency through update events",
      "Creators can extend deadlines if more participation is needed",
    ],
    icon: <LockOpenIcon className="h-4 w-4" />,
  },
  {
    title: "Fixed-Term Bounty (Non-Editable)",
    description: [
      "All parameters are locked after creation",
      "Provides absolute certainty for participants about rules/terms",
      "Higher trust level as creators cannot alter conditions",
      "Automatically enforces strict deadlines",
      "Best for high-stakes competitions where fairness is critical",
    ],
    icon: <LockIcon className="h-4 w-4" />,
  },
];

const FormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  content: z.string().min(1, {
    message: "Content is required.",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format.",
  }),
  minParticipants: z.number().int().positive({
    message: "Minimum participants should be more than 0.",
  }),
  deadline: z.date({
    message: "Deadline is required.",
  }),
  resultDeadline: z.date({
    message: "Result deadline is required.",
  }),
  totalWinners: z.coerce.number().min(1, "Must have at least 1 winner"),
  prizes: z.array(
    z.object({
      value: z.coerce.number().min(1, "This field is required"),
    })
  ),
  totalPrizes: z.coerce.number().min(1, "This field is required"),
  bountyType: z.coerce.number().min(1, "This field is required"),
});

const FormBounty = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      totalWinners: 1,
      bountyType: 1,
    },
  });

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

  const OrdinalDisplay = ({ number }: { number: number }) => {
    const { num, suffix } = getOrdinalParts(number);
    return (
      <span>
        {num}
        <sup className="text-[0.6em] font-medium">{suffix}</sup>
      </span>
    );
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="p-4 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title of the bounty"
                    className="text-sm"
                    {...field}
                    autoFocus={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={() => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Tiptap />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resultDeadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Result Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minParticipants"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Min. Participants</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Minimum participants"
                      {...field}
                      type="number"
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator orientation="horizontal" />
        <div className="p-4 space-y-4">
          <div className="text-lg font-semibold">Prize</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="totalWinners"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Total Winners</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Total winners"
                      {...field}
                      type="number"
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalPrizes"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Total Prizes + Platform fee (5%)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Total prizes"
                        {...field}
                        type="number"
                        className="text-sm"
                        disabled
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <div className="flex items-center justify-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                          LYX
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fields.map((field, index) => (
              <div key={field.id}>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`prizes.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
                          Input {index + 1}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder={`Prize winner ${getOrdinal(
                                index + 1
                              )} in LYX`}
                              className="text-sm"
                              {...field}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                                <OrdinalDisplay number={index + 1} />
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator orientation="horizontal" />
        <div className="p-4 space-y-4">
          <div className="text-lg font-semibold">Bounty Type</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {BOUNTY_TYPES.map((type, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start p-4 border rounded-lg cursor-pointer hover:bg-accent",
                  bountyType === index
                    ? "border-primary border-2"
                    : "border-accent border-2"
                )}
                onClick={() => form.setValue("bountyType", index)}
              >
                <div className="flex-shrink-0">{type.icon}</div>
                <div className="ml-4">
                  <div className="text-sm font-semibold">{type.title}</div>
                  <ul className="mt-2 text-sm text-gray-600">
                    {type.description.map((desc, i) => (
                      <li key={i} className="flex items-center">
                        <span className="mr-2">•</span>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator orientation="horizontal" />
        <div className="flex justify-end p-4">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default FormBounty;
