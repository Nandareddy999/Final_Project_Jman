{{ config(
  materialized='table',
  schema='Mart'
) }}

-- Calculate the total hours worked per day for each user
with total_hours_per_day as (
    select
        _id,
        startdate,
        enddate,
        username,
        useremail,
        Comment,
        SUM(t.value::int) as total_hours_per_day
    from {{ ref('stg_timesheet') }},
    lateral flatten(input => parse_json(totalHoursPerDay)) as t
    GROUP BY
        _id,
        startdate,
        enddate,
        username,
        useremail,
        Comment
),

-- Calculate the average total hours worked per day across all users
average_hours_per_day as (
    select
        ROUND(AVG(total_hours_per_day), 2) as average_hours_per_day
    from total_hours_per_day
)

SELECT * FROM average_hours_per_day
