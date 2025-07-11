import fs from 'fs-extra';
import xlsx from 'xlsx';

const FILE_PATH = process.env.USER_LOG_FILE ;

export const logUserToExcel = async (userData) => {
  try {
    let workbook;
    let worksheet;
    let existingData = [];

    if (fs.existsSync(FILE_PATH)) {
      const file = xlsx.readFile(FILE_PATH);
      worksheet = file.Sheets[file.SheetNames[0]];
      existingData = xlsx.utils.sheet_to_json(worksheet);
      workbook = file;
    } else {
      workbook = xlsx.utils.book_new();
    }

    // Check if user already exists (based on phone)
    const alreadyLogged = existingData.some(
      (entry) => entry.phone === userData.phone
    );

    if (alreadyLogged) return;

    const updatedData = [...existingData, userData];
    const newWorksheet = xlsx.utils.json_to_sheet(updatedData);
    xlsx.utils.book_append_sheet(workbook, newWorksheet, 'Users', true);
    xlsx.writeFile(workbook, FILE_PATH);
  } catch (err) {
    console.error('Failed to log user to Excel:', err);
  }
};
