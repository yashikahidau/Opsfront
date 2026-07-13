"use client";

import { useEffect, useState } from "react";

import {
  Comment,
  getComments,
  addComment,
} from "@/lib/comment";

export function useComments(
  ticketId: string
) {
  const [comments, setComments] =
    useState<Comment[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function refresh() {
    try {
      const response =
        await getComments(ticketId);

      setComments(response.comments);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ticketId) {
      refresh();
    }
  }, [ticketId]);

  async function createComment(
    message: string
  ) {
    const response =
      await addComment(
        ticketId,
        message
      );

    setComments((prev) => [
      ...prev,
      response.comment,
    ]);
  }

  return {
    comments,
    loading,
    createComment,
    refresh,
  };
}