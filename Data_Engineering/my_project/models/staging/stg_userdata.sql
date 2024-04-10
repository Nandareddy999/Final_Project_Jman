{{ config(
  materialized='table',
  schema='Staging'
) }}

with Userdata AS(
  SELECT *
  FROM
    {{ source('NANDAJMAN', 'USERDATA') }}
),
casted_data AS (
    SELECT
        CAST(id AS VARCHAR(50)) AS id,
        CAST(firstname AS VARCHAR(255)) AS firstname,
        CAST(lastname AS VARCHAR(255)) AS lastname,
        CAST(email AS VARCHAR(255)) AS email,
        CAST(Password AS VARCHAR) AS Password,
        CAST(role AS VARCHAR(40)) AS role
    FROM Userdata
)
SELECT * FROM casted_data
