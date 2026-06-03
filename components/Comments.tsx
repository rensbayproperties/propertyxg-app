import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getTimeAgo } from "@/lib/utils";
import { getFirstLetter } from "@/constant/data";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComments } from "@/hooks/useComment";
import Container from "./Container";

export const Comments = (props: {
  allowSubmit: boolean;
  resource_type_id: string;
  resource_type: string;
  callback: () => void;
}) => {
  const { resource_type_id, resource_type, callback, allowSubmit } = props;

  const {
    comments,
    isLoadingComment,
    comment,
    isCommentPending,
    commentForm,
    handleComment,
  } = useComments(resource_type, resource_type_id, callback);

  return (
    <Container size="xs" className="p-0">
      <div>
        <div className="text-brand font-semibold mb-3 flex gap-2">
          <i className="bi-chat-fill"></i>Comments
        </div>
        <div className="flex flex-col gap-4">
          <div>
            {allowSubmit && (
              <Form {...commentForm}>
                <form onSubmit={commentForm.handleSubmit(handleComment)}>
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={commentForm.control}
                      name="comment"
                      disabled={isCommentPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Add comment..."
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex">
                      <Button
                        type="submit"
                        loading={isCommentPending}
                        variant={"brand"}
                        size={"sm"}
                      >
                        {isCommentPending ? "Posting" : "Post"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {isLoadingComment ? (
              <div className="flex justify-center items-center">
                <Loader2 className={cn("h-4 w-4 animate-spin")} />
              </div>
            ) : (
              comments?.data?.map((comment: any) => (
                <div
                  className="flex justify-start items-start gap-2 p-2 bg-card-alt rounded-sm border"
                  key={comment.comment_created}
                >
                  <Avatar>
                    <AvatarFallback>
                      {getFirstLetter(
                        `${comment.user.first_name} ${comment.user.last_name}`,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center gap-2">
                      <div className="font-bold">{`${comment.user.first_name} ${comment.user.last_name}`}</div>
                      <div className="text-xs opacity-60 flex gap-1 items-center">
                        <i className="bi-clock text-[.625rem]"></i>{" "}
                        {getTimeAgo(comment.created_on!)}{" "}
                      </div>
                    </div>
                    <p className="text-sm opacity-80">{comment.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
