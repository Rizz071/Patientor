import { useState, useEffect, SyntheticEvent } from "react";
import { Diagnosis, EntryWithoutId, HealthCheckRating } from "../../types";

import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  FormControl,
  FormHelperText,
} from "@mui/material";
import axios from "axios";

interface Props {
  onCancel: () => void;
  onSubmit: (newEntry: EntryWithoutId) => void;
}

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [specialist, setSpecialist] = useState<string>("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [employerName, setEmployerName] = useState<string>("");

  //   const [discharge, setDischarge] = useState<Discharge>({} as Discharge);
  const [dischargeDate, setDischargeDate] = useState<Date>(new Date());
  const [dischargeCriteria, setDischargeCriteria] = useState<string>("");

  //   const [sickLeave, setSickLeave] = useState<SickLeave>({} as SickLeave);
  const [startDateSickLeave, setStartDateSickLeave] = useState<Date>(
    new Date()
  );
  const [endDateSickLeave, setEndDateSickLeave] = useState<Date>(new Date());

  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(3);
  const [type, setType] = useState<string>("");

  const [diagnosisCodesArray, setDiagnosisCodesArray] = useState<Diagnosis[]>(
    []
  );

  useEffect(() => {
    const getDiagnosisCodes = async () => {
      try {
        const { data } = await axios.get<Diagnosis[]>(
          "http://127.0.0.1:3001/api/diagnoses"
        );
        setDiagnosisCodesArray(data);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e?.response?.data && typeof e?.response?.data === "string") {
            const message = e.response.data.replace(
              "Something went wrong. Error: ",
              ""
            );
            console.error(message);
            // setError(message);
          } else {
            // setError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", e);
          //   setError("Unknown error");
        }
      }
    };
    void getDiagnosisCodes();
  }, []);

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    switch (type) {
      case "Hospital":
        const newHospitalEntry: EntryWithoutId = {
          description,
          date: date.toISOString().split("T")[0],
          specialist,
          diagnosisCodes,
          type: "Hospital",
          discharge: {
            date: dischargeDate.toISOString().split("T")[0],
            criteria: dischargeCriteria,
          },
        };
        onSubmit(newHospitalEntry);
        break;

      case "Occupational healthcare":
        const newOccupationalHealthcareEntry: EntryWithoutId = {
          description,
          date: date.toISOString().split("T")[0],
          specialist,
          diagnosisCodes,
          type: "OccupationalHealthcare",
          employerName,
          sickLeave: {
            startDate: startDateSickLeave.toISOString().split("T")[0],
            endDate: endDateSickLeave.toISOString().split("T")[0],
          },
        };
        onSubmit(newOccupationalHealthcareEntry);
        break;

      case "Health check":
        const newHealthCheckEntry: EntryWithoutId = {
          description,
          date: date.toISOString().split("T")[0],
          specialist,
          diagnosisCodes,
          type: "HealthCheck",
          healthCheckRating,
        };
        onSubmit(newHealthCheckEntry);
        break;

      default:
        throw Error("Wrong entry type");
    }
  };

  return (
    <form onSubmit={addEntry}>
      <FormControl required fullWidth>
        <InputLabel sx={{ mx: -2 }}>Entry type</InputLabel>
        <Select
          label="Entry type"
          value={type}
          onChange={({ target }) => setType(target.value)}
          sx={{ my: 0.5 }}
          size="small"
          fullWidth
          variant="standard"
        >
          {["Hospital", "Occupational healthcare", "Health check"].map(
            (option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            )
          )}
        </Select>
        {!type && (
          <FormHelperText sx={{ mx: 0, color: "red" }}>
            Please, select entry type first
          </FormHelperText>
        )}
      </FormControl>

      <TextField
        required
        label="Description"
        fullWidth
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        sx={{ my: 0.5 }}
        size="small"
        variant="standard"
      />
      <TextField
        required
        label="Date"
        type="date"
        fullWidth
        value={date.toISOString().split("T")[0]}
        onChange={({ target }) => setDate(new Date(target.value))}
        sx={{ my: 0.5 }}
        size="small"
        variant="standard"
      />
      <TextField
        required
        label="Specialist"
        fullWidth
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
        sx={{ my: 0.5 }}
        size="small"
        variant="standard"
      />

      <FormControl required fullWidth>
        <InputLabel sx={{ mx: -2, marginTop: 1 }}>Diagnosis codes</InputLabel>
        <Select
          autoWidth
          label="Diagnosis codes"
          value={diagnosisCodes}
          multiple
          onChange={({ target }) =>
            setDiagnosisCodes(
              typeof target.value === "string"
                ? target.value.split(",")
                : target.value
            )
          }
          sx={{ my: 0.5 }}
          size="small"
          variant="standard"
        >
          {/* <MenuList > */}
          {diagnosisCodesArray.map((elem) => (
            <MenuItem sx={{ maxWidth: 300 }} key={elem.code} value={elem.code}>
              {elem.code}
            </MenuItem>
          ))}
          {/* </MenuList> */}
        </Select>
        {!diagnosisCodes && (
          <FormHelperText sx={{ mx: 0, color: "red" }}>
            Please, select diagnosis codes from list
          </FormHelperText>
        )}
      </FormControl>

      {type === "Hospital" && (
        <div>
          <TextField
            required
            label="Discharge date"
            fullWidth
            type="date"
            value={dischargeDate.toISOString().split("T")[0]}
            onChange={({ target }) => setDischargeDate(new Date(target.value))}
            sx={{ my: 0.5 }}
            size="small"
            variant="standard"
          />
          <TextField
            required
            label="Discharge criteria"
            fullWidth
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
            sx={{ my: 0.5 }}
            size="small"
            variant="standard"
          />
        </div>
      )}

      {type === "Occupational healthcare" && (
        <div>
          <TextField
            required
            label="Employer name"
            fullWidth
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
            sx={{ my: 0.5 }}
            size="small"
            variant="standard"
          />
          <TextField
            label="Start date"
            type="date"
            fullWidth
            value={startDateSickLeave.toISOString().split("T")[0]}
            onChange={({ target }) =>
              setStartDateSickLeave(new Date(target.value))
            }
            sx={{ my: 0.5 }}
            size="small"
            variant="standard"
          />
          <TextField
            label="Start date"
            type="date"
            fullWidth
            value={endDateSickLeave.toISOString().split("T")[0]}
            onChange={({ target }) =>
              setEndDateSickLeave(new Date(target.value))
            }
            sx={{ my: 0.5 }}
            size="small"
            variant="standard"
          />
        </div>
      )}

      {type === "Health check" && (
        <FormControl required fullWidth>
          <InputLabel sx={{ mx: -2, marginTop: 1 }}>
            Health check rating
          </InputLabel>
          <Select
            autoWidth
            label="Health check rating"
            value={healthCheckRating}
            onChange={({ target }) =>
              setHealthCheckRating(Number(target.value))
            }
            sx={{ my: 0.5 }}
            size="small"
            variant="standard"
          >
            {Object.keys(HealthCheckRating)
              .filter((key) => isNaN(Number(key)))
              .map((elem, index) => {
                return (
                  <MenuItem key={index} value={index}>
                    {elem}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      )}

      <Grid sx={{ my: 2 }}>
        <Grid item>
          <Button
            color="secondary"
            variant="contained"
            style={{ float: "left" }}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Grid>
        {type && (
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default AddEntryForm;
