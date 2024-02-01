import { Patient, Diagnosis, patientsWithoutSSN, Gender, Entry, SickLeave, HealthCheckRating } from '../types/types';
import diagnosesData from '../../data/diagnoses';
import patientsData from '../../data/patients-full';

import { v4 as uuid } from 'uuid';




const diagnoses: Diagnosis[] = diagnosesData;
const patients: Patient[] = patientsData;

const getAllPatients = (): patientsWithoutSSN[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => {
        return {
            id,
            name,
            dateOfBirth,
            gender,
            occupation,
            entries
        };
    });
};

const getPatient = (id: string): Patient => {
    const foundedPatient: Patient | undefined = patientsData.find((patient: Patient) => patient.id === id);

    if (foundedPatient) {
        return foundedPatient;
    } else {
        throw new Error('Patient not found in the database');
    }
};

const getAllDiagnoses = (): Diagnosis[] => {
    return diagnoses;
};

const postEntry = (newEntry: unknown, patient_id: string): Entry => {
    const patient = patients.find(patient => patient.id === patient_id);

    if (!patient) throw Error('Patient not found');

    if (!newEntry
        || typeof newEntry !== 'object'
        || !('type' in newEntry)
        || !('description' in newEntry)
        || !('date' in newEntry)
        || !('specialist' in newEntry)) {

        throw Error('Incorret one or more entry fields');
    }

    //Generating random id
    const id = uuid();

    switch (newEntry.type) {
        case 'Hospital':
            if (!('discharge' in newEntry)
                || !(typeof newEntry.discharge === 'object')
                || !newEntry.discharge
                || !('date' in newEntry.discharge)
                || !('criteria' in newEntry.discharge)) {

                throw Error('Invalid data in Discharge fields');
            }

            const checkedHospitalEntry: Entry = {
                type: 'Hospital',
                id: parseString(id),
                description: parseString(newEntry.description),
                date: parseString(newEntry.date),
                specialist: parseString(newEntry.specialist),
                diagnosisCodes: parseDiagnosisCodes(newEntry),
                discharge: {
                    date: parseString(newEntry.discharge.date),
                    criteria: parseString(newEntry.discharge.criteria),
                },
            };
            patient.entries.push(checkedHospitalEntry);
            return checkedHospitalEntry;

        case 'OccupationalHealthcare':
            if (!('employerName' in newEntry)) {
                throw Error('Invalid data in employerName field');
            }

            const checkedOccupationHealthcareEntry: Entry = {
                type: 'OccupationalHealthcare',
                id: parseString(id),
                description: parseString(newEntry.description),
                date: parseString(newEntry.date),
                specialist: parseString(newEntry.specialist),
                diagnosisCodes: parseDiagnosisCodes(newEntry),
                employerName: parseString(newEntry.employerName),
                sickLeave: parseSickLeave(newEntry)
            };

            patient.entries.push(checkedOccupationHealthcareEntry);
            return checkedOccupationHealthcareEntry;

        case 'HealthCheck':
            if (!('healthCheckRating' in newEntry)) {
                throw Error('Invalid data in employerName field');
            }

            const checkedHealthCheckEntry: Entry = {
                type: 'HealthCheck',
                id: parseString(id),
                description: parseString(newEntry.description),
                date: parseString(newEntry.date),
                specialist: parseString(newEntry.specialist),
                diagnosisCodes: parseDiagnosisCodes(newEntry),
                healthCheckRating: parseHealthCheckRating(newEntry.healthCheckRating),
            };

            patient.entries.push(checkedHealthCheckEntry);
            return checkedHealthCheckEntry;

        default:
            throw Error('Wrong Entry type');
    }
};

const addPatient = (receivedPatient: unknown): Patient => {

    //Generating random id
    const id = uuid();

    //Testing for object type (narrowing)
    if (!receivedPatient || typeof receivedPatient !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    //Testing if all required field came (narrowing)
    if ('name' in receivedPatient &&
        'dateOfBirth' in receivedPatient &&
        'ssn' in receivedPatient &&
        'gender' in receivedPatient &&
        'occupation' in receivedPatient
    ) {
        const newPatient: Patient = {
            id,
            name: parseString(receivedPatient.name),
            dateOfBirth: parseString(receivedPatient.dateOfBirth),
            ssn: parseString(receivedPatient.ssn),
            gender: parseGender(receivedPatient.gender),
            occupation: parseString(receivedPatient.occupation),
            entries: []
        };

        //Saving right object to dummy hardcoded database
        patientsData.push(newPatient);

        //Returning saved object for sending back to frontend
        return newPatient;
    } else {
        throw new Error('Incorrect data: some fields are missing!');
    }

};

//Testing for string type
const isString = (testObject: unknown): testObject is string => {
    return typeof testObject === 'string' || testObject instanceof String;
};

//Testing for gender type (enum)
const isGender = (testGender: string): testGender is Gender => {
    return Object.values(Gender).map(g => g.toString()).includes(testGender);
};

//Parsing incoming field
const parseString = (testObject: unknown): string => {
    if (!testObject || !isString(testObject)) {
        throw new Error('Error in patient description!');
    }

    return testObject;
};

//Parsing gender field
const parseGender = (receivedGender: unknown): Gender => {
    if (!Gender || !isString(receivedGender) || !isGender(receivedGender)) {
        throw new Error('Error in gender field description!');
    }

    const newGender: Gender = receivedGender;
    return newGender;
};

const parseSickLeave = (object: unknown): SickLeave => {
    if (!object
        || typeof object !== 'object'
        || !('sickLeave' in object)
        || typeof object.sickLeave !== 'object'
        || !object.sickLeave
        || !('startDate' in object.sickLeave)
        || !('endDate' in object.sickLeave)) {

        return {} as SickLeave;
    }

    return {
        startDate: parseString(object.sickLeave.startDate),
        endDate: parseString(object.sickLeave.endDate)
    };
};

const parseHealthCheckRating = (object: unknown): HealthCheckRating => {
    if (object !== 1 && object !== 2 && object !== 3 && object !== 0) {
        throw Error('Invalid data in Health Rating');
    }
    return object;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        // we will just trust the data to be in correct form
        return [] as Array<Diagnosis['code']>;
    }

    return object.diagnosisCodes as Array<Diagnosis['code']>;
};

export default {
    getAllDiagnoses, getAllPatients, addPatient, getPatient,
    parseDiagnosisCodes, postEntry
};