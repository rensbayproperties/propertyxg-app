// import { ContactColumns } from "@/types"; // define your contacts type

// export const exportContactsToPDF = async (contacts: ContactColumns[]) => {
//   if (!contacts || contacts.length === 0) return;

//   // Only run on client
//   if (typeof window === "undefined") return;

//   // Dynamically import jsPDF and autotable
//   const { jsPDF } = await import("jspdf");
//   await import("jspdf-autotable");

//   const doc = new jsPDF();

//   // Extract headers from first contact
//   const headers = Object.keys(contacts[0]);
//   const data = contacts.map(contact =>
//     headers.map(h => contact[h as keyof ContactColumns] ?? "")
//   );

//   // Generate table
//   (doc as any).autoTable({
//     head: [headers],
//     body: data,
//     startY: 20,
//   });

//   // Save PDF
//   doc.save("contacts.pdf");
// };
