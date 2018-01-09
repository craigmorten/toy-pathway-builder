# toy-pathway-builder

A toy project for creating pathways from csv files.

## Usage

1. Clone this repository.

1. Add a folder in the base directory of the project called `./data/`

1. Add the following csv files to this new directory:

    - AdmissionCodes.csv
    - AdmissionsDates.csv
    - CCI.csv
    - Measurements.csv
    - PatientCorePopulatedTable.csv
    - Physio.csv
    - Questionaires.csv

1. Generate the parsed data files with

    ```js
    npm start
    ```

1. View the UI by opening `./src/index.html` in a web browser.