import { apiRequest } from "./api";
import { getStoredToken } from "./auth";

export interface Comment {
     _id: string;

     message: string;

     isInternal: boolean;

     createdAt: string;

     author: {
          _id: string;
          name: string;
          email: string;
     };
}

interface CommentsResponse {
     success: boolean;
     comments: Comment[];
}

interface CommentResponse {
     success: boolean;
     comment: Comment;
}

function token() {
  const authToken = getStoredToken();

  if (!authToken) {
    throw new Error("Not authenticated.");
  }

  return authToken;
}

export function getComments(
     ticketId: string
) {
     return apiRequest<CommentsResponse>(
          `/api/comments/${ticketId}`,
          {
               token: token(),
          }
     );
}

export function addComment(
     ticketId: string,
     message: string
) {
     return apiRequest<CommentResponse>(
          `/api/comments/${ticketId}`,
          {
               method: "POST",

               token: token(),

               body: {
                    message,
               },
          }
     );
}