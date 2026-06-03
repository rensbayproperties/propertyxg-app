import { axiosAuth } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { commentSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type CommentFormData = z.infer<typeof commentSchema>;

export const useComments = (
  resource_type: string,
  resource_type_id: string,
  callback: () => void
) => {
  const queryClient = useQueryClient();
  const { data: comments, isLoading: isLoadingComment } = useQuery({
    queryKey: ["comments", resource_type, resource_type_id],
    queryFn: async () => {
      const response: any = await axiosAuth.get(
        `/comments/${resource_type}/${resource_type_id}`
      );
      const result = response.data.data;

      return result;
    },
  });

  const commentForm = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const { mutateAsync: comment, isPending: isCommentPending } = useMutation({
    mutationFn: (credentials: CommentFormData) => {
      const modifiedComment = {
        ...credentials,
        resource_type: resource_type,
        resource_type_id: resource_type_id,
      };
      const res = axiosAuth.post(`/comments`, modifiedComment);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", resource_type, resource_type_id],
      });
      callback();
      toast("Success", {
        description: "Comment posted successfully.",
      });
      commentForm.reset();
    },
  });

  const handleComment = async (values: CommentFormData) => {
    try {
      await comment(values);
    } catch (err) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  return {
    comments,
    isLoadingComment,
    isCommentPending,
    comment,
    commentForm,
    handleComment,
  };
};
