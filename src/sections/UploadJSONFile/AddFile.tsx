import {
  Alert,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
} from '@mui/material';
import { useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, useTable } from 'src/components/table';
import { paths } from 'src/routes/paths';
import * as XLSX from 'xlsx';
import AddFileTableRow from './AddFileTableRow';
import useAddFile from './http/useAddFile';
import { useGetFile } from './http/useGetFile';
import { toast } from 'sonner';

const TABLE_HEAD = [
  { id: 'fileName', label: 'File Name' },
  { id: 'file', label: 'File' },
  { id: 'action', label: 'Action' },
];

const AddFile = () => {
  const table = useTable();
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState('');

  const { data, isLoading } = useGetFile();
  const { mutate, isPending } = useAddFile();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return toast.error('Please select a file');
    if (!name) return toast.error('Please enter file name');

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonResult = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonResult[0]?.EN || !jsonResult[0]?.TS) {
        return toast.error('File should have 2 mandatory columns i.e. "EN" and "TS"');
      }

      const result = {};
      jsonResult.forEach((row) => {
        const key = `"${row['EN']?.trim()}"`;
        const value = row['TS']?.trim();
        if (key && value) {
          result[key] = value;
        }
      });

      if (!result) return toast.error('Please select a valid file');

      mutate({ body: result, row: name.toLowerCase() + '.json' });

      setShow(false);
      setSelectedFile(null);
      setName('');
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const dialogBox = (
    <Dialog
      open={show}
      onClose={() => {
        setShow(false);
        setSelectedFile(null);
        setName('');
      }}
    >
      <DialogTitle>Add New Translation File</DialogTitle>
      <DialogContent className="flex gap-2 flex-col">
        <input
          className="p-2 border outline-none rounded border-gray-400"
          type="text"
          value={name}
          placeholder="Type Name of the file (small case) without spaces eg: english"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="p-2 border outline-none rounded border-gray-400"
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={(e) => handleFileChange(e)}
        />
        <Alert severity="info">
          Make sure file should have 2 mandatory columns i.e. "EN" and "TS". "EN" is for English
          Words and "TS" is for Translated Words.
        </Alert>
        <Alert severity="warning">Select .csv or .xlsx file only</Alert>
      </DialogContent>
      <DialogActions>
        <button
          disabled={isPending}
          onClick={handleUpload}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {isPending ? 'Loading...' : 'Add File'}
        </button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <CustomBreadcrumbs
        heading="Add File"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add File' }]}
        sx={{ mb: 3 }}
        action={
          <span
            onClick={() => setShow(true)}
            className="bg-black cursor-pointer text-white rounded-md justify-center flex items-center px-2 py-3 gap-2 md:w-[9rem]"
          >
            <Iconify icon="mingcute:add-line" /> Add New File
          </span>
        }
      />

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Card>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
              />

              <TableBody>
                {data && data.map((row, i) => <AddFileTableRow key={i} row={row} />)}
              </TableBody>
            </Table>
          </Scrollbar>
        </Card>
      )}
      {dialogBox}
    </>
  );
};

export default AddFile;
