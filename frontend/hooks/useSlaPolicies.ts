"use client";

import { useEffect, useState } from "react";

import {
  getSlaDashboard,
  updatePolicy,
  UpdatePolicyInput,
  SlaPolicy,
  SlaHealth,
} from "@/lib/slaPolicies";

export function useSlaPolicies() {
  const [loading, setLoading] =
    useState(true);

  const [policies, setPolicies] =
    useState<SlaPolicy[]>([]);

  const [health, setHealth] =
    useState<SlaHealth | null>(null);

  const [recommendations, setRecommendations] =
    useState<string[]>([]);


  async function refresh() {
    try {
      setLoading(true);

      const response =
        await getSlaDashboard();

      setPolicies(response.policies);

      setHealth(response.health);

      setRecommendations(
        response.recommendations
      );
    } finally {
      setLoading(false);
    }
  }

  async function editPolicy(
  id: string,
  data: UpdatePolicyInput
) {
  await updatePolicy(id, data);

  await refresh();
}


  useEffect(() => {
    refresh();
  }, []);

  return {
  loading,
  policies,
  health,
  recommendations,
  refresh,
  editPolicy,
};
}