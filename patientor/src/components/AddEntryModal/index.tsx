import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Alert,
} from "@mui/material";

import AddPatientForm from "./AddEntryForm";
import { EntryWithoutId } from "../../types";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (newEntry: EntryWithoutId) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && (
        <Alert sx={{ marginBottom: 2 }} severity="error">
          {error}
        </Alert>
      )}
      <AddPatientForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;
