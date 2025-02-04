import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  MenuList,
  TableCell,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import * as XLSX from 'xlsx';
import useAddFile from './http/useAddFile';
import { useGetSingleFile } from './http/useGetSingleFile';
import { imgUrl } from 'src/utils/BaseUrls';

const AddFileTableRow = (row) => {
  const popover = usePopover();
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  // const { data, isLoading } = useGetSingleFile(row?.row);
  const { mutate, isPending } = useAddFile(jsonData, row?.row);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonResult = XLSX.utils.sheet_to_json(worksheet);

      const result = {};
      jsonResult.forEach((row) => {
        const key = `"${row['EN']?.trim()}"`;
        const value = row['ES']?.trim();
        if (key && value) {
          result[key] = value;
        }
      });

      setJsonData(result);
      mutate();
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const dialogBox = (
    <Dialog
      open={show}
      onClose={() => {
        setShow(false);
        setSelectedFile(null);
        setJsonData(null);
      }}
    >
      <DialogTitle>
        Add New <span className="capitalize text-red-600">"{row?.row?.replace('.json', '')}"</span>{' '}
        File
      </DialogTitle>
      <DialogContent>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
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
            Add New File
          </Button>
        </TableCell>
      </TableRow>

      {dialogBox}
    </>
  );
};

export default AddFileTableRow;
