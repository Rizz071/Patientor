import { Diagnosis, Entry, EntryWithoutId, Patient } from "../types";
import { useParams } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  Container,
  Button,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import axios, { isAxiosError } from "axios";
import { useState, useEffect } from "react";
import EntryDetails from "./EntryDetails";
import AddEntryModal from "./AddEntryModal";
import servicePatients from "../services/patients";
import WorkSharpIcon from "@mui/icons-material/WorkSharp";
import MaleSharpIcon from "@mui/icons-material/MaleSharp";
import FemaleSharpIcon from "@mui/icons-material/FemaleSharp";
import TransgenderSharpIcon from "@mui/icons-material/TransgenderSharp";
import Grid3x3SharpIcon from "@mui/icons-material/Grid3x3Sharp";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";

const PatientDetail = () => {
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();

  const id: string | undefined = useParams().id;

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (newEntry: EntryWithoutId) => {
    if (id) {
      try {
        const receivedNewEntry = await servicePatients.postEntry(newEntry, id);
        if (patient && "entries" in patient) {
          patient.entries.push(receivedNewEntry);
          closeModal();
        }
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e?.response?.data && typeof e?.response?.data === "string") {
            const message = e.response.data.replace(
              "Something went wrong. Error: ",
              ""
            );
            console.error(message);
            setError(message);
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
      }
    }
  };

  if (!id) {
    throw new Error("Wrong patient id");
  }

  useEffect(() => {
    axios
      .get<Patient>(`http://127.0.0.1:3001/api/patients/${id}`)
      .then((response) => {
        setPatient(response.data);
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          console.log(error);
        }
      });
  }, [id]);

  useEffect(() => {
    axios
      .get<Diagnosis[]>(`http://127.0.0.1:3001/api/diagnoses`)
      .then((response) => {
        setDiagnoses(response.data);
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          console.log(error);
        }
      });
  }, []);

  if (patient && diagnoses) {
    return (
      <>
        <AddEntryModal
          modalOpen={modalOpen}
          error={error}
          onSubmit={submitNewEntry}
          onClose={closeModal}
        />
        <List disablePadding dense={true}>
          <ListItem disablePadding>
            <Typography
              variant="h3"
              style={{ marginBottom: "0.5em", marginTop: "0.5em" }}
            >
              {patient.name}
            </Typography>
          </ListItem>
          <ListItem disablePadding>
            {patient.gender && (
              <>
                <ListItemIcon>
                  {patient.gender === "male" && (
                    <MaleSharpIcon fontSize="large" />
                  )}
                  {patient.gender === "female" && (
                    <FemaleSharpIcon fontSize="large" />
                  )}
                  {patient.gender === "other" && (
                    <TransgenderSharpIcon fontSize="large" />
                  )}
                </ListItemIcon>
                <ListItemText primary={patient.gender} secondary="Gender" />
              </>
            )}
          </ListItem>
          <ListItem disablePadding>
            {patient.ssn && (
              <>
                <ListItemIcon>
                  <Grid3x3SharpIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText primary={patient.ssn} secondary="Ssn" />
              </>
            )}
          </ListItem>
          <ListItem disablePadding>
            {patient.dateOfBirth && (
              <>
                <ListItemIcon>
                  <CalendarMonthSharpIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText
                  primary={patient.dateOfBirth}
                  secondary="Date of birth"
                />
              </>
            )}
          </ListItem>
          <ListItem disablePadding>
            {patient.occupation && (
              <>
                <ListItemIcon>
                  <WorkSharpIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText
                  primary={patient.occupation}
                  secondary="Ocupation"
                />
              </>
            )}
          </ListItem>
          <Button
            sx={{ my: 2 }}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            Add entry
          </Button>
          {patient.entries.length !== 0 && (
            <Container sx={{ my: 0 }}>
              <List>
                <ListItem disablePadding divider={true}>
                  <Typography sx={{ my: 1 }} variant="h6">
                    Entries
                  </Typography>
                </ListItem>
                {patient.entries.map((e: Entry) => {
                  return (
                    <ListItem
                      disablePadding
                      key={e.id}
                      divider={true}
                      sx={{ my: 2 }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ marginBottom: "15px" }}>
                          <Typography variant="body2">
                            <strong>{e.date}</strong> {e.description}
                          </Typography>

                          <div>
                            <EntryDetails entry={e} />
                          </div>
                        </div>
                        <div>
                          {e.diagnosisCodes && (
                            <List
                              sx={{
                                listStyleType: "disc",
                                mx: 3,
                                marginTop: -2,
                              }}
                            >
                              {e.diagnosisCodes.map((c) => {
                                return (
                                  <ListItem
                                    disablePadding
                                    sx={{ display: "list-item" }}
                                    key={Math.round(Math.random() * 1000000)}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <div style={{ width: "3.5em" }}>{c}</div>
                                      <div>
                                        {
                                          diagnoses.find(
                                            (diagnosis) => diagnosis.code === c
                                          )?.name
                                        }
                                      </div>
                                    </div>
                                  </ListItem>
                                );
                              })}
                            </List>
                          )}
                        </div>
                      </div>
                    </ListItem>
                  );
                })}
              </List>
            </Container>
          )}
        </List>
      </>
    );
  }
};

export default PatientDetail;
