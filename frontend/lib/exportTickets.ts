import { Ticket } from "./ticket";

export function exportTicketsToCSV(
  tickets: Ticket[]
) {
  const rows = tickets.map((ticket) => ({
    ID: ticket._id,
    Title: ticket.title,
    Description: ticket.description,
    Status: ticket.status,
    Priority: ticket.priority,
    Category: ticket.category,
    Requester: ticket.createdBy.name,
    Assignee: ticket.assignedTo?.name ?? "Unassigned",
    Risk: ticket.riskScore,
    SLA: ticket.slaDeadline ?? "",
    Created: new Date(
      ticket.createdAt
    ).toLocaleString(),
  }));

  const headers = Object.keys(rows[0] ?? {});

  const csv = [
    headers.join(","),

    ...rows.map((row) =>
      headers
        .map((header) =>
          JSON.stringify(
            row[
              header as keyof typeof row
            ]
          )
        )
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download = `tickets-${Date.now()}.csv`;

  link.click();

  URL.revokeObjectURL(url);
}