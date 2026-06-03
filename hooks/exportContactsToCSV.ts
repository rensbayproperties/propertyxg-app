// hooks/exportContactsToCSV.ts
import { ContactColumns } from "@/types";

export const exportContactsToCSV = (contacts?: ContactColumns[]) => {
  if (!contacts || contacts.length === 0) {
    console.warn("No contacts to export");
    return;
  }

  const firstContact = contacts[0];
  if (!firstContact) return;

  const headers = Object.keys(firstContact);
  const rows = contacts.map(contact =>
    headers.map(header => `"${contact[header as keyof ContactColumns] ?? ""}"`).join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\n");

  // Create Blob and URL
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);

  // Create temporary link
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "contacts.csv");

  // Append, click, remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke URL after a short delay to ensure download triggers
  setTimeout(() => window.URL.revokeObjectURL(url), 100);
};
