"use client";

import { useEffect, useState } from "react";
import {
  getSettings,
  updateSettings,
  WorkspaceSettings,
} from "@/lib/settings";

export function useSettings() {
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [settings, setSettings] =
    useState<WorkspaceSettings | null>(null);

  async function loadSettings() {
    try {
      const data = await getSettings();

      setSettings(data.settings);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings(
  updates: Partial<WorkspaceSettings>
) {
  if (!settings) return;

  try {
    setSaving(true);

    const response = await updateSettings(updates);

    setSettings(response.settings);

    return true;
  } finally {
    setSaving(false);
  }
}

  useEffect(() => {
    loadSettings();
  }, []);

  
  return {
  loading,
  saving,
  settings,
  saveSettings,
  refresh: loadSettings,
};
}