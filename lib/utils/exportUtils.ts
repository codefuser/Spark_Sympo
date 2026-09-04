/**
 * Utility functions for exporting Symposium Registration Data to multiple formats:
 * - JSON (.json)
 * - CSV (.csv with UTF-8 BOM)
 * - Excel (.xls spreadsheet table)
 * - PDF (Formatted printable document with print trigger)
 */

export function exportToJSON(data: any[], filename = "sparktron_registrations.json") {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportToCSV(registrations: any[], filename = "sparktron_registrations.csv") {
  const headers = [
    "Pass Code",
    "Registration Type",
    "Team Name",
    "Member Index",
    "Full Name",
    "Email",
    "Phone",
    "College",
    "Department",
    "Food Preference",
    "Technical Event Track",
    "Non-Technical Event Track",
    "Payment Status",
    "Transaction UTR",
    "Registration Date",
  ];

  const rows: string[][] = [];

  registrations.forEach((r) => {
    const members = r.participants || [];
    if (members.length === 0) {
      rows.push([
        r.registrationCode || "N/A",
        r.registrationType || "online",
        r.teamName || "",
        "N/A",
        "No Participant Data",
        "",
        "",
        "",
        "",
        "",
        r.technicalEvent?.title || "",
        r.nonTechnicalEvent?.title || "",
        r.paymentStatus || "UNPAID",
        r.transactionId || "",
        new Date(r.createdAt).toLocaleDateString("en-GB"),
      ]);
    } else {
      members.forEach((p: any, idx: number) => {
        rows.push([
          r.registrationCode || "N/A",
          r.registrationType || "online",
          r.teamName || "",
          `#${idx + 1}`,
          p.fullName || "",
          p.email || "",
          p.phone || "",
          p.college || "",
          p.department || "ECE",
          p.foodPreference || "Veg",
          r.technicalEvent?.title || "",
          r.nonTechnicalEvent?.title || "",
          r.paymentStatus || "UNPAID",
          r.transactionId || "",
          new Date(r.createdAt).toLocaleDateString("en-GB"),
        ]);
      });
    }
  });

  const escapeCSV = (val: string) => `"${String(val || "").replace(/"/g, '""')}"`;
  const csvContent =
    "\uFEFF" +
    [headers.map(escapeCSV).join(","), ...rows.map((row) => row.map(escapeCSV).join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(registrations: any[], filename = "sparktron_registrations.xls") {
  let tableHTML = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>SPARKTRON Registrations</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        th { background-color: #1e293b; color: #ffffff; font-weight: bold; font-family: Arial, sans-serif; padding: 10px; border: 1px solid #334155; }
        td { font-family: Arial, sans-serif; font-size: 12px; padding: 8px; border: 1px solid #cbd5e1; vertical-align: top; }
        .paid { color: #166534; font-weight: bold; }
        .unpaid { color: #991b1b; font-weight: bold; }
      </style>
    </head>
    <body>
      <h2>SPARKTRON 2K26 Registered Participants Report</h2>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table>
        <thead>
          <tr>
            <th>Pass Code</th>
            <th>Type</th>
            <th>Team Name</th>
            <th>Member #</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>College</th>
            <th>Department</th>
            <th>Food</th>
            <th>Technical Track</th>
            <th>Non-Technical Track</th>
            <th>Payment Status</th>
            <th>Transaction UTR</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
  `;

  registrations.forEach((r) => {
    const members = r.participants || [];
    if (members.length === 0) {
      tableHTML += `
        <tr>
          <td><b>${r.registrationCode}</b></td>
          <td>${r.registrationType}</td>
          <td>${r.teamName || "-"}</td>
          <td>-</td>
          <td>No Member Data</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>${r.technicalEvent?.title || ""}</td>
          <td>${r.nonTechnicalEvent?.title || ""}</td>
          <td class="${r.paymentStatus === "PAID" ? "paid" : "unpaid"}">${r.paymentStatus || "UNPAID"}</td>
          <td>${r.transactionId || "-"}</td>
          <td>${new Date(r.createdAt).toLocaleDateString("en-GB")}</td>
        </tr>
      `;
    } else {
      members.forEach((p: any, idx: number) => {
        tableHTML += `
          <tr>
            ${idx === 0 ? `<td rowspan="${members.length}"><b>${r.registrationCode}</b></td>` : ""}
            ${idx === 0 ? `<td rowspan="${members.length}">${r.registrationType}</td>` : ""}
            ${idx === 0 ? `<td rowspan="${members.length}">${r.teamName || "-"}</td>` : ""}
            <td>#${idx + 1} ${p.isTeamLeader ? "(Leader)" : ""}</td>
            <td><b>${p.fullName || "-"}</b></td>
            <td>${p.email || "-"}</td>
            <td>${p.phone || "-"}</td>
            <td>${p.college || "-"}</td>
            <td>${p.department || "ECE"}</td>
            <td>${p.foodPreference || "Veg"}</td>
            ${idx === 0 ? `<td rowspan="${members.length}">${r.technicalEvent?.title || ""}</td>` : ""}
            ${idx === 0 ? `<td rowspan="${members.length}">${r.nonTechnicalEvent?.title || ""}</td>` : ""}
            ${idx === 0 ? `<td rowspan="${members.length}" class="${r.paymentStatus === "PAID" ? "paid" : "unpaid"}">${r.paymentStatus || "UNPAID"}</td>` : ""}
            ${idx === 0 ? `<td rowspan="${members.length}">${r.transactionId || "-"}</td>` : ""}
            ${idx === 0 ? `<td rowspan="${members.length}">${new Date(r.createdAt).toLocaleDateString("en-GB")}</td>` : ""}
          </tr>
        `;
      });
    }
  });

  tableHTML += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function exportToPDF(registrations: any[]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const totalPasses = registrations.length;
  const totalParticipants = registrations.reduce((acc, r) => acc + (r.participants?.length || 0), 0);

  let rowsHTML = "";
  registrations.forEach((r, rIdx) => {
    const members = r.participants || [];
    if (members.length === 0) {
      rowsHTML += `
        <tr>
          <td>${rIdx + 1}</td>
          <td><strong>${r.registrationCode}</strong><br/><small>${r.registrationType}</small></td>
          <td colspan="4" style="color: #64748b; font-style: italic;">No participant details recorded</td>
          <td>${r.technicalEvent?.title || "-"}<br/><small>${r.nonTechnicalEvent?.title || "-"}</small></td>
          <td><strong style="color: ${r.paymentStatus === "PAID" ? "#166534" : "#991b1b"}">${r.paymentStatus || "UNPAID"}</strong></td>
        </tr>
      `;
    } else {
      members.forEach((p: any, pIdx: number) => {
        rowsHTML += `
          <tr>
            ${pIdx === 0 ? `<td rowspan="${members.length}">${rIdx + 1}</td>` : ""}
            ${pIdx === 0 ? `<td rowspan="${members.length}"><strong>${r.registrationCode}</strong><br/><span style="text-transform: uppercase; font-size: 10px; font-weight: bold; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${r.registrationType}</span>${r.teamName ? `<br/><small>Team: ${r.teamName}</small>` : ""}</td>` : ""}
            <td><strong>#${pIdx + 1} ${p.fullName}</strong><br/><small>${p.email}</small></td>
            <td>${p.college}<br/><small style="font-weight: bold; color: #475569;">Dept: ${p.department || "ECE"}</small></td>
            <td>${p.phone}</td>
            <td><span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${p.foodPreference === "Non-Veg" ? "#fee2e2" : "#dcfce7"}; color: ${p.foodPreference === "Non-Veg" ? "#991b1b" : "#166534"};">${p.foodPreference || "Veg"}</span></td>
            ${pIdx === 0 ? `<td rowspan="${members.length}"><strong>Tech:</strong> ${r.technicalEvent?.title || "-"}<br/><strong>Non-Tech:</strong> ${r.nonTechnicalEvent?.title || "-"}</td>` : ""}
            ${pIdx === 0 ? `<td rowspan="${members.length}"><strong style="color: ${r.paymentStatus === "PAID" ? "#166534" : "#991b1b"}">${r.paymentStatus || "UNPAID"}</strong>${r.transactionId ? `<br/><small>UTR: ${r.transactionId}</small>` : ""}</td>` : ""}
          </tr>
        `;
      });
    }
  });

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SPARKTRON 2K26 - Registrations Report</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #0f172a; margin: 0; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 22px; font-weight: bold; color: #1e293b; margin: 0; }
        .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
        .metrics { display: flex; gap: 20px; margin-bottom: 20px; }
        .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 16px; flex: 1; }
        .metric-card span { font-size: 10px; text-transform: uppercase; font-weight: bold; color: #64748b; }
        .metric-card p { font-size: 20px; font-weight: bold; margin: 4px 0 0 0; color: #1e293b; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
        th { background: #1e293b; color: white; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
        td { border: 1px solid #cbd5e1; padding: 8px 10px; vertical-align: top; }
        tr:nth-child(even) { background-color: #f8fafc; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">SPARKTRON 2K26 SYMPOSIUM</h1>
          <p class="subtitle">St. Joseph's Institute of Technology • Department of ECE • Official Registration Roster</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 11px; font-weight: bold; margin: 0; color: #2563eb;">Date: ${new Date().toLocaleDateString("en-GB")}</p>
          <p style="font-size: 10px; color: #64748b; margin-top: 2px;">Generated via Admin Portal</p>
        </div>
      </div>

      <div class="metrics">
        <div class="metric-card">
          <span>Total Registration Passes</span>
          <p>${totalPasses}</p>
        </div>
        <div class="metric-card">
          <span>Total Registered Participants</span>
          <p>${totalParticipants}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Pass Code</th>
            <th>Student Details</th>
            <th>College & Dept</th>
            <th>Phone</th>
            <th>Food</th>
            <th>Events Registered</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
