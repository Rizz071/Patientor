export interface Diagnosis {
    "code": string,
    "name": string,
    "latin"?: string
}

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}


interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Diagnosis['code'][];
}

interface Discharge {
    date: string;
    criteria: string;
}

interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: Discharge;
}

export interface SickLeave {
    startDate: string;
    endDate: string;
}

interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: SickLeave;
}

interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

export type Entry =
    | HospitalEntry
    | OccupationalHealthcareEntry
    | HealthCheckEntry;

export interface Patient {
    "id": string,
    "name": string,
    "dateOfBirth": string,
    "ssn": string,
    "gender": string,
    "occupation": string,
    "entries": Entry[]
}

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other'
}

export type patientsWithoutSSN = Omit<Patient, 'ssn' | 'entry'>;
