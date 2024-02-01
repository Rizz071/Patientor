import express from 'express';
import cors from 'cors';


import patientorService from './src/services/patientorService';
import { Patient } from './src/types/types';

const app = express();

app.use(cors());
app.use(express.json());


app.get('/api/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
    res.status(200).send(patientorService.getAllDiagnoses());
});

app.get('/api/patients/:id', (req, res) => {
    try {
        res.status(200).send(patientorService.getPatient(req.params.id));
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(404).send(error.message);
    }
});


app.post('/api/patients/:id/entries', (req, res) => {
    try {
        const patient_id: string = req.params.id;
        const newEntry: unknown = req.body;
        res.status(201).send(patientorService.postEntry(newEntry, patient_id));
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(400).send(error.message);
    }
});


app.get('/api/patients', (_req, res) => {
    res.status(200).send(patientorService.getAllPatients());
});

app.post('/api/patients', (req, res) => {
    try {
        const newPatient: Patient = patientorService.addPatient(req.body);
        res.status(201).send(newPatient);
    }
    catch (error) {
        let errorMessage = 'Something went wrong';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});