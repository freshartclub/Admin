import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { imgUrl } from 'src/utils/BaseUrls';
import * as XLSX from 'xlsx';
import useAddFile from './http/useAddFile';
import { toast } from 'sonner';

const AddFileTableRow = (row) => {
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { mutate, isPending } = useAddFile();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      return toast.error('Please select a file first.');
    }

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

      mutate({ body: result, row: row?.row });

      setShow(false);
      setSelectedFile(null);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const dialogBox = (
    <Dialog
      open={show}
      onClose={() => {
        setShow(false);
        setSelectedFile(null);
      }}
    >
      <DialogTitle>
        Add New <span className="capitalize text-red-600">"{row?.row?.replace('.json', '')}"</span>{' '}
        Version
      </DialogTitle>
      <DialogContent className="flex flex-col gap-2">
        <input
          className="p-2 border outline-none rounded border-gray-400 w-full"
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={(e) => handleFileChange(e)}
        />
        <Alert severity="info">
          Make sure file should have 2 mandatory columns i.e. "EN" and "TS". "EN" is for English
          Words and "TS" is for Translated Words.
        </Alert>
        <Alert severity="warning">Select .csv, .xlsx or .xls file only</Alert>
      </DialogContent>
      <DialogActions>
        <button
          disabled={isPending}
          onClick={handleUpload}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {isPending ? 'Uploading...' : 'Upload File'}
        </button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }} className="capitalize">
          {row?.row ? row?.row?.replace('.json', '') : 'N/A'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
          <Iconify
            onClick={() => window.open(`${imgUrl}/lang/${row?.row}`, '_blank')}
            color="orange"
            icon="si:json-fill"
          />
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            onClick={() => setShow(true)}
          >
            <Iconify color="orange" icon="si:json-fill" />
            Add New Version
          </Button>
        </TableCell>
      </TableRow>

      {dialogBox}
    </>
  );
};

export default AddFileTableRow;
