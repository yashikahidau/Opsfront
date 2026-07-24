"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { apiRequest } from "@/lib/api";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NotificationsResponse {
  success: boolean;
  unreadCount: number;
  notifications: Notification[];
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  entityId: string;
  entityType: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res =
        await apiRequest<NotificationsResponse>(
          "/api/notifications"
        );

      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id: string) => {
    try {
      await apiRequest(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );

      setUnreadCount((c) => Math.max(c - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await apiRequest("/api/notifications/read-all", {
        method: "PATCH",
      });

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-border bg-card/50 text-muted-foreground transition hover:bg-card hover:text-foreground">
        <Bell className="size-4" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-black">
            {unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[calc(100vw-2rem)] sm:w-96 rounded-2xl sm:rounded-3xl border border-border bg-card p-0"
      >
        <PopoverHeader className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <PopoverTitle className="text-sm sm:text-base font-semibold">
                Notifications
              </PopoverTitle>

              <PopoverDescription className="mt-0.5 sm:mt-1 text-xs sm:text-sm">
                Stay updated with activity across your workspace.
              </PopoverDescription>
            </div>

            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="shrink-0 text-xs text-primary hover:underline whitespace-nowrap"
              >
                Mark all
              </button>
            )}
          </div>
        </PopoverHeader>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-8 sm:px-6 sm:py-12 text-center">
            <div className="mb-4 sm:mb-5 rounded-full bg-primary/10 p-3 sm:p-4">
              <CheckCircle2 className="size-6 sm:size-8 text-primary" />
            </div>

            <h3 className="text-sm sm:text-base font-semibold">
              You're all caught up
            </h3>

            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
              No notifications yet.
            </p>
          </div>
        ) : (
          <div className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto">
            {notifications.map((notification) => (
              <Link
                key={notification._id}
                href={`/dashboard/tickets/${notification.entityId}`}
                onClick={() => {
                  if (!notification.isRead) {
                    markRead(notification._id);
                  }
                }}
                className={`block border-b border-border p-3.5 sm:p-4 transition hover:bg-muted/50 ${
                  !notification.isRead ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  {!notification.isRead && (
                    <span className="mt-1.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-primary shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium leading-snug">
                      {notification.title}
                    </h4>

                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>

                    <p className="mt-1.5 text-[10px] sm:text-xs text-muted-foreground">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}