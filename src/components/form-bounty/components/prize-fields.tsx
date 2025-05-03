/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, getOrdinal, getOrdinalParts } from "@/lib/utils";

interface PrizeFieldsProps {
  form: any;
  fields: any[];
}

const PrizeFields: React.FC<PrizeFieldsProps> = ({ form, fields }) => {
  const OrdinalDisplay = ({ number }: { number: number }) => {
    const { num, suffix } = getOrdinalParts(number);
    return (
      <span>
        {num}
        <sup className="text-[0.6em] font-medium">{suffix}</sup>
      </span>
    );
  };
  return (
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
        <div className="col-span-full mt-1 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-muted">
          <p className="font-medium">Platform Fee Information:</p>
          <p>
            A 5% platform fee will be applied to the total prize amount. This
            fee helps maintain and improve the platform services.
          </p>
        </div>
      </div>
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          fields.length === 2
            ? "md:grid-cols-2"
            : fields.length > 2
            ? "md:grid-cols-3"
            : "md:grid-cols-1"
        )}
      >
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex-1">
              <FormField
                control={form.control}
                name={`prizes.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Input {index + 1}</FormLabel>
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
  );
};

export default PrizeFields;
