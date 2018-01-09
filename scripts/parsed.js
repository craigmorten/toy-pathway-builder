/**
 * parsed.js
 * 
 * To take the admission json file and parse it to be a more sensible format.
 */

const admissionsDates = require('../data/AdmissionsDates.json');
const admissionCodes = require('../data/AdmissionCodes.json');
const cci = require('../data/CCI.json');
const patientCorePopulatedTable = require('../data/PatientCorePopulatedTable.json');
const measurements = require('../data/Measurements.json');
const physio = require('../data/Physio.json');
const questionaires = require('../data/Questionaires.json');

let parsedAdmissionsDates = admissionsDates.reduce((a, v, i, y) => {
    if (!a[v.PatientID]) {
        a[v.PatientID] = [];
    }
    a[v.PatientID].push(v);
    return a;
}, {});

let parsedAdmissionCodes = admissionCodes.reduce((a, v, i, y) => {
    if (!a[v.PatientID]) {
        a[v.PatientID] = [];
    }
    a[v.PatientID].push(v);
    return a;
}, {});

let parsedCCI = cci.reduce((a, v, i, y) => {
    if (!a[v.PatientID]) {
        a[v.PatientID] = [];
    }
    a[v.PatientID].push(v);
    return a;
}, {});

let parsedMeasurements = measurements.reduce((a, v, i, y) => {
    if (!a[v.PatientID]) {
        a[v.PatientID] = [];
    }
    a[v.PatientID].push(v);
    return a;
}, {});

let parsedPatientCorePopulatedTable = patientCorePopulatedTable.reduce((a, v, i, y) => {
    if (!a[v.PatientID]) {
        a[v.PatientID] = [];
    }
    a[v.PatientID].push(v);
    return a;
}, {});

let parsedPhysio = physio.reduce((a, v, i, y) => {
    if (!a[v.PatientID]) {
        a[v.PatientID] = [];
    }
    a[v.PatientID].push(v);
    return a;
}, {});

let parsedQuestionaires = questionaires.reduce((a, v, i, y) => {
    if (!a[v.PatientID]) {
        a[v.PatientID] = [];
    }
    a[v.PatientID].push(v);
    return a;
}, {});

module.exports = {
    AdmissionsDates: () => {
        return parsedAdmissionsDates;
    },
    AdmissionCodes: () => {
        return parsedAdmissionCodes;
    },
    CCI: () => {
        return parsedCCI;
    },
    Measurements: () => {
        return parsedMeasurements;
    },
    PatientCorePopulatedTable: () => {
        return parsedPatientCorePopulatedTable;
    },
    Physio: () => {
        return parsedPhysio;
    },
    Questionaires: () => {
        return parsedQuestionaires;
    },
};