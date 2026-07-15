"use client";

import { useEffect, useState } from "react";

import {
  getUsers,
  getAssignedTickets,
  updateRole,
  User,
  AssignedTicket,
  reassignTickets,
  createUser,
CreateUserInput,
} from "@/lib/user";

export function useUsers() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

    const [tickets, setTickets] =
  useState<AssignedTicket[]>([]);

  async function refresh() {
    try {
      const response =
        await getUsers();

      setUsers(response.users);
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(
    id: string,
    role: User["role"]
  ) {
    await updateRole(id, role);

    await refresh();
  }

  async function loadTickets(
  id: string
) {
  const response =
    await getAssignedTickets(id);

  setTickets(response.tickets);
}

async function reassign(
  fromUserId: string,
  toUserId: string
) {
  await reassignTickets(
    fromUserId,
    toUserId
  );

  refresh();
}

async function addUser(
  data: CreateUserInput
) {
  await createUser(data);

  await refresh();
}

  useEffect(() => {
    refresh();
  }, []);

 return {
  users,
  tickets,
  loading,
  refresh,
  changeRole,
  loadTickets,
  reassign,
  addUser,
};
}