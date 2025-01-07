"use client";

import { z } from "zod";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { updateCourse } from "@/actions/courses";
import { cn } from "@/lib/utils";

import type { Course } from "@prisma/client";
import Image from "next/image";
import { FileUploader } from "@/components/shared/file-uploader";
import { url } from "inspector";

interface Props {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z
    .string()
    .min(1, {
      message: "Image is required",
    })
    .optional(),
});

export const ImageForm = ({ courseId, initialData }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { imageUrl: initialData.imageUrl ?? undefined },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log("🚀 ~ onSubmit ~ values:", values);
    try {
      const course = await updateCourse(courseId, values);
      if ((course as { error: string })?.error)
        toast.error((course as { error: string }).error);
      else {
        toast.success("Course updated");
        toggleEditing();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button variant={`ghost`} onClick={toggleEditing}>
          {isEditing && <>Cancel</>}
          {!isEditing &&
            (initialData.imageUrl ? (
              <>
                <Pencil className="h-4 w-4" />
                Edit image
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Add an image
              </>
            ))}
        </Button>
      </div>
      {!isEditing &&
        (initialData.imageUrl ? (
          <div className="relative aspect-video mt-2">
            <Image
              src={initialData.imageUrl}
              alt="Uplaod Course image"
              fill
              className="rounded-md object-cover"
            />
          </div>
        ) : (
          <div
            className={cn(
              `flex items-center justify-center h-60 bg-slate-200 rounded-md`
            )}
          >
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ))}

      {isEditing && (
        <div className="">
          <FileUploader
            endpoint="courseImage"
            onChange={(url) => {
              if (url) onSubmit({ imageUrl: url });
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
