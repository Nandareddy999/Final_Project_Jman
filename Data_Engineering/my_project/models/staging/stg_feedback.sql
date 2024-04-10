{{ config(
  materialized='table',
  schema='Staging'
) }}

WITH Feedback AS (
    SELECT *
    FROM {{ source('NANDAJMAN', 'FEEDBACK') }}
),
casted_data AS (
    SELECT
        CAST(_id AS VARCHAR(50)) AS _id,
        CAST(questionid AS VARCHAR(50)) AS questionid,
        TO_DATE(startdate, 'YYYY-MM-DD') AS startdate,
        TO_DATE(enddate, 'YYYY-MM-DD') AS enddate,
        CAST(username AS VARCHAR(255)) AS username,
        ARRAY_CONSTRUCT(CAST(ratings AS VARCHAR)) AS ratings,
        CAST(feedback AS VARCHAR(255)) AS feedback
    FROM Feedback
)
SELECT * FROM casted_data
