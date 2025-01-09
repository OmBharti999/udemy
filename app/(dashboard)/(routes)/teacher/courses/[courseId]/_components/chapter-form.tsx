"use client";

import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Chapter, Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";

import { createChapter } from "@/actions/courses";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface Props {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Chapter title is required",
  }),
});

export const ChapterForm = ({ courseId, initialData }: Props) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: undefined },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleCreating = () => {
    setIsCreating((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log("🚀 ~ onSubmit ~ values:", values);
    try {
      const course = await createChapter(courseId, values);
      if ((course as { error: string })?.error)
        toast.error((course as { error: string }).error);
      else {
        toast.success("Chapter created");
        toggleCreating();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button variant={`ghost`} onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <div
            className={cn("text-sm mt-2", {
              "text-slate-500 italic": !initialData.chapters.length,
            })}
          >
            {!initialData.chapters.length && "No chapters"}
          </div>
          <p className={cn(`text-xs text-muted-foreground`, {})}>
            Drag and drop to reorder the chapters
          </p>
        </>
      )}
    </div>
  );
};
