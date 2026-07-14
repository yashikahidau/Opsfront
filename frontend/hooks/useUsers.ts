"use client";

import { useEffect, useState } from "react";

import {
  getUsers,
  User,
} from "@/lib/user";

export function useUsers() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response =
          await getUsers();

        setUsers(response.users);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    users,
    loading,
  };
}