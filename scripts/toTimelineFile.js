/**
 * toTimelineFile.js
 * 
 * Try and take the parsed json and output a useful pathway tree json files for each PatientID.
 */

const fs = require('fs');
const parsed = require('./parsed.js');
const writeFilePath = './src/timeline.js';
const writeFilePathJson = './data/timeline.json';

const admissionDates = parsed.AdmissionsDates();
const admissionCodes = parsed.AdmissionCodes();
const cciData = parsed.CCI();
const measurements = parsed.Measurements();
const physioSessions = parsed.Physio();
const questionaires = parsed.Questionaires();

const timelines = {};

function uuid() {
    return 'uuid-xxxx-xxxx-xxxx-xxx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function clone(_$) {
    return JSON.parse(JSON.stringify(_$));
}

function timestamp(_d) {
    const s = _d.split('/');
    const m = s[1] - 1;
    return new Date(s[2], m, s[0]).getTime();
}

// Get admission codes by patient and admission ID
function getAdmissionCodes(__patientID, __AdmissionID) {
    const patientCodes = admissionCodes[__patientID];
    return patientCodes.filter((v, i, a) => {
        return (v.AdmissionID === __AdmissionID);
    });
}

// Event Object for when the patient takes a CCI survey
function newCCIEvent(__patientID, __cci) {
    __cci = clone(__cci);
    __cci.type = __cci.type || 'cci';
    __cci.summary = __cci.summary || `#${__cci.AdmissionID} CCI Questionaire`;
    return newTimelineEvent(__cci);
}

// Event Object for when a patient is tested for something in the lab
function newMeasurementEvent(__patientID, __measurement) {
    __measurement = clone(__measurement);
    __measurement.type = __measurement.type || 'measurement';
    __measurement.summary = __measurement.summary || `#${__measurement.AdmissionID} Measurement ${__measurement.LabName}: ${__measurement.LabValue}${__measurement.LabUnits}`;
    return newTimelineEvent(__measurement);
}

// Event Object for when a patient is given a questionaire
function newQuestionaireEvent(__patientID, __questionaire) {
    __questionaire = clone(__questionaire);
    __questionaire.type = __questionaire.type || 'questionaire';
    __questionaire.summary = __questionaire.summary || `${__questionaire.Type || 'Unknown'} Questionaire: ${__questionaire.Value}`;
    return newTimelineEvent(__questionaire);
}

// Event Object for when a patient is given a physio session
function newPhysioEvent(__patientID, __physio) {
    __physio = clone(__physio);
    __physio.type = __physio.type || 'physio';
    __physio.summary = __physio.summary || `Physio Session`;
    return newTimelineEvent(__physio);
}

// Event Object for when a patient is admitted into hospital/care etc.
function newAdmissionEvent(__patientID, __admission) {
    __admission = clone(__admission);
    __admission.type = __admission.type || 'admission';
    __admission.summary = __admission.summary || `Admission #${__admission.AdmissionID} of ${__patientID}`;
    __admission.codes = getAdmissionCodes(__patientID, __admission.AdmissionID);
    return newTimelineEvent(__admission);
}

// Event Object for when a patient is released from hospital/care etc.
function newReleaseEvent(__patientID, __admission) {
    __admission = clone(__admission);
    __admission.type = __admission.type || 'release';
    __admission.summary = __admission.summary || `Release of ${__patientID} from admission #${__admission.AdmissionID}`;
    return newTimelineEvent(__admission);
}

// Event Object for a generic event
function newTimelineEvent(__event) {
    return {
        id: __event.id || uuid(),
        type: __event.type || 'misc',
        AdmissionID: __event.AdmissionID || '',
        summary: __event.summary || '',
        codes: __event.codes || [],
    };
}

// Timeline Date Object
function newTimelineDate() {
    return {
        events: []
    };
}

module.exports = {
    run: () => {
        for (let patientID in admissionDates) {
            timelines[patientID] = timelines[patientID] || {};

            let timeline = timelines[patientID];

            // Admissions and all data containing an admission code but no date
            for (let admission of admissionDates[patientID]) {
                const startDate = timestamp(admission.AdmissionStartDate);
                const endDate = timestamp(admission.AdmissionEndDate);

                if (!timeline[startDate]) {
                    timeline[startDate] = newTimelineDate();
                }
                timeline[startDate].events.push(newAdmissionEvent(patientID, admission));

                if (!timeline[endDate]) {
                    timeline[endDate] = newTimelineDate();
                }
                timeline[endDate].events.push(newReleaseEvent(patientID, admission));
            }

            // CCI
            for (let cci of cciData[patientID]) {
                const date = timestamp(cci.Date);

                if (!timeline[date]) {
                    timeline[date] = newTimelineDate();
                }
                timeline[date].events.push(newCCIEvent(patientID, cci));
            }

            // Measurements
            for (let measurement of measurements[patientID]) {
                const date = timestamp(measurement.LabDateTime);

                if (!timeline[date]) {
                    timeline[date] = newTimelineDate();
                }
                timeline[date].events.push(newMeasurementEvent(patientID, measurement));
            }

            // Questionaires
            for (let questionaire of questionaires[patientID]) {
                const date = timestamp(questionaire.Date);

                if (!timeline[date]) {
                    timeline[date] = newTimelineDate();
                }
                timeline[date].events.push(newQuestionaireEvent(patientID, questionaire));
            }

            // Physio sessions
            for (let physio of physioSessions[patientID]) {
                const date = timestamp(physio.Date);

                if (!timeline[date]) {
                    timeline[date] = newTimelineDate();
                }
                timeline[date].events.push(newPhysioEvent(patientID, physio));
            }
        }

        fs.writeFileSync(writeFilePathJson, JSON.stringify(timelines), (err) => {
            if (err) {
                console.log(err);
            }
        });

        fs.writeFileSync(writeFilePath, `const timeline = ${JSON.stringify(timelines)};`, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
};