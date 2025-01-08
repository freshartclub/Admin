import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const downloadReports = async ({ header, data, fileName }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet();

  worksheet.columns = header.map((key) => ({
    header: key,
    key: key,
    width: key?.style?.width ? key.style?.width : Math.max(25, key.length),
    style: {
      font: key?.style?.font || {},
    },
  }));

  data.forEach((row) => {
    worksheet.addRow(Object.values(row));
  });

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], { type: 'application/octet-stream' }),
    `${fileName}${(Math.random() * 100).toFixed(0)}.xlsx`
  );
};
