"use client";

import type React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { LockOpenIcon, LockIcon } from "lucide-react";

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

interface BountyTypeSelectionProps {
  form: any;
  bountyType: number;
  mode: "create" | "edit";
}

const BountyTypeSelection: React.FC<BountyTypeSelectionProps> = ({
  form,
  bountyType,
  mode,
}) => {
  const isDisabled = mode === "edit";

  return (
    <div className="p-4 space-y-4">
      <div className="text-lg font-semibold">Bounty Type</div>
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-4",
          isDisabled && "opacity-70"
        )}
      >
        {BOUNTY_TYPES.map((type, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start p-4 border rounded-lg",
              bountyType === index
                ? "border-primary border-2"
                : "border-accent border-2",
              isDisabled
                ? "cursor-not-allowed"
                : "cursor-pointer hover:bg-accent"
            )}
            onClick={() => {
              if (!isDisabled) {
                form.setValue("bountyType", index);
              }
            }}
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
      {isDisabled && (
        <div className="text-sm text-muted-foreground italic">
          Bounty type cannot be changed after creation
        </div>
      )}
    </div>
  );
};

export default BountyTypeSelection;
