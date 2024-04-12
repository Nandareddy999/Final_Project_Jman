{{ config(
  materialized='table',
  schema='Staging'
) }}

with Timesheet AS(
  SELECT *
  FROM
    {{ source('NANDAJMAN', 'TIMESHEET') }}
),
casted_data AS (
    SELECT
        CAST(_id AS VARCHAR(50)) AS _id,
        TO_DATE(startdate, 'YYYY-MM-DD') AS startdate,
        TO_DATE(enddate, 'YYYY-MM-DD') AS enddate,
        CAST(username AS VARCHAR(255)) AS username,
        CAST(useremail AS VARCHAR(255)) AS useremail,
        CAST(comment AS VARCHAR(255)) AS comment,
        CAST(totalhoursperday AS VARCHAR) AS totalhoursperday,
        CAST(totalhours AS INT) AS totalhours,
        CAST(activities AS VARCHAR(255)) AS activities
    FROM Timesheet
)
SELECT * FROM casted_data