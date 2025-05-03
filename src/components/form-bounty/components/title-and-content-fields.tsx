/* eslint-disable @typescript-eslint/no-explicit-any */
import Tiptap from "@/components/tiptap";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TitleAndContentFieldsProps {
  form: any;
  defaultContent?: string;
}

const TitleAndContentFields: React.FC<TitleAndContentFieldsProps> = ({ form, defaultContent }) => {
  return (
    <>
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
              <Tiptap key={defaultContent} customContent={defaultContent} onChange={(html) => form.setValue("content", html)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TitleAndContentFields;
