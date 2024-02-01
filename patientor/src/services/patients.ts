import axios from "axios";

import { Entry, EntryWithoutId, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const postEntry = async (newEntry: EntryWithoutId, patient_id: string) => {
  const response = await axios.post<EntryWithoutId>(`http://127.0.0.1:3001/api/patients/${patient_id}/entries`, newEntry);
  return response.data as Entry;
};


export default {
  getAll, create, postEntry
};

