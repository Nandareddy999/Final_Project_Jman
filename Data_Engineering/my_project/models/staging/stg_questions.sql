{{ config(
  materialized='table',
  schema='Staging'
) }}

with Questions AS(
  SELECT *
  FROM
    {{ source('NANDAJMAN', 'QUESTIONS') }}
),
casted_data AS (
    SELECT
        CAST(_id AS VARCHAR(50)) AS _id,
        CAST(userid AS VARCHAR(255)) AS userid,
        ARRAY_CONSTRUCT(CAST(questions AS VARCHAR)) AS questions
    FROM Questions
)
SELECT * FROM casted_data

