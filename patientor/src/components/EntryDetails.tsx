import assertNever from "assert-never";
import { Entry } from "../types";
import { Typography } from "@mui/material";

import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";

const EntryDetails = ({ entry }: { entry: Entry }) => {
  // console.log(entry.type);
  switch (entry.type) {
    case "Hospital":
      return (
        <Typography variant="body2">
          <strong>Discharge:</strong> {entry.discharge.date}{" "}
          {entry.discharge.criteria}
        </Typography>
      );

    case "HealthCheck":
      const healthBar = [];
      for (let i = 1; i <= 5 - entry.healthCheckRating; i++)
        healthBar.push(
          <FavoriteSharpIcon
            key={Math.round(Math.random() * 1000000)}
            fontSize="small"
            color="primary"
            sx={{ verticalAlign: "bottom" }}
          />
        );
      for (let i = 1; i <= entry.healthCheckRating; i++)
        healthBar.push(
          <FavoriteBorderSharpIcon
            key={Math.round(Math.random() * 1000000)}
            fontSize="small"
            color="primary"
            sx={{ verticalAlign: "bottom" }}
          />
        );

      return (
        <Typography variant="body2">
          <strong>Health check rating:</strong> {healthBar}
        </Typography>
      );

    case "OccupationalHealthcare":
      return (
        <div>
          <Typography variant="body2">
            <strong>Employer name:</strong> {entry.employerName}
          </Typography>
          {entry.sickLeave && (
            <Typography variant="body2">
              <strong>Sick leave</strong> from {entry.sickLeave.startDate} to{" "}
              {entry.sickLeave.endDate}
            </Typography>
          )}
        </div>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
