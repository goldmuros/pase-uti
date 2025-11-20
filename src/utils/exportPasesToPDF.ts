import type { Paciente } from "@/types/Paciente";
import type { PaseType } from "@/types/Pase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportPasesProps {
  pases: PaseType[];
  pacientes: Paciente[];
  fecha: string;
}

// Función auxiliar para obtener el nombre del paciente
const getPacienteNombre = (
  pacienteId: string,
  pacientes: Paciente[]
): string => {
  const paciente = pacientes.find(p => p.id === pacienteId);
  return paciente ? `${paciente.nombre} ${paciente.apellido}` : "N/A";
};

export const exportPasesToPDF = ({
  pases,
  pacientes,
  fecha,
}: ExportPasesProps) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 5;

  // Fecha del reporte
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha de Reporte: ${fecha}`, pageWidth / 2, margin + 5, {
    align: "center",
  });

  // Separador
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, margin + 10, pageWidth - margin, margin + 10);

  // Preparar datos para la tabla
  const tableData = pases.map((pase, index) => [
    index + 1, // Nº
    getPacienteNombre(pase.paciente_id, pacientes), // PACIENTE
    pase.principal || "N/A", // PRINCIPAL
    pase.antecedentes || "N/A", // ANTECEDENTES
    pase.gcs_rass || "N/A", // GCS/RASS
    pase.atb || "N/A", // ATB
    pase.vc_cook || "N/A", // VC/COOK
    pase.actualmente || "N/A", // ACTUALMENTE
    pase.pendientes || "N/A", // PENDIENTES
  ]);

  // Configurar y generar tabla
  autoTable(doc, {
    head: [
      [
        "Nº",
        "PACIENTE",
        "PRINCIPAL",
        "ANTECEDENTES",
        "GCS/RASS",
        "ATB",
        "VC/COOK",
        "ACTUALMENTE",
        "PENDIENTES",
      ],
    ],
    body: tableData,
    startY: margin + 15,
    margin: margin,
    styles: {
      font: "helvetica",
      fontSize: 6,
      cellPadding: 1.5,
      overflow: "linebreak",
      halign: "left",
      valign: "top",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      fontSize: 7,
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [240, 248, 255],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 8 },
      1: { halign: "left", cellWidth: 20 },
      2: { halign: "left", cellWidth: 22 },
      3: { halign: "left", cellWidth: 22 },
      4: { halign: "left", cellWidth: 16 },
      5: { halign: "left", cellWidth: 16 },
      6: { halign: "left", cellWidth: 16 },
      7: { halign: "left", cellWidth: 22 },
      8: { halign: "left", cellWidth: 22 },
    },
    didDrawPage: function (data) {
      // Pie de página
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.getHeight();
      const pageWidth = pageSize.getWidth();

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(`Página ${data.pageNumber}`, pageWidth / 2, pageHeight - 3, {
        align: "center",
      });
    },
  });

  // Generar nombre del archivo
  const fechaFormato = fecha.split(" ")[0]; // Obtener solo la parte de la fecha
  const filename = `Pases_Medicos_${fechaFormato}.pdf`;

  // Descargar PDF
  doc.save(filename);
};

// Función alternativa más compacta
export const exportPasesToPDFCompacto = ({
  pases,
  pacientes,
  fecha,
}: ExportPasesProps) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 5;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Reporte: ${fecha}`, pageWidth / 2, margin + 5, {
    align: "center",
  });

  doc.line(margin, margin + 10, pageWidth - margin, margin + 10);

  // Tabla compacta
  const tableData = pases.map(pase => [
    getPacienteNombre(pase.paciente_id, pacientes),
    pase.principal?.substring(0, 40) || "N/A",
    pase.atb?.substring(0, 30) || "N/A",
    pase.actualmente?.substring(0, 40) || "N/A",
    pase.pendientes?.substring(0, 40) || "N/A",
  ]);

  autoTable(doc, {
    head: [["PACIENTE", "PRINCIPAL", "ATB", "ACTUALMENTE", "PENDIENTES"]],
    body: tableData,
    startY: margin + 15,
    margin: margin,
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 2,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  const fechaFormato = fecha.split(" ")[0];
  doc.save(`Pases_Medicos_${fechaFormato}.pdf`);
};
