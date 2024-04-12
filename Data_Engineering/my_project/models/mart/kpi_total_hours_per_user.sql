{{ config(
  materialized='table',
  schema='Mart'
) }}

-- Calculate the total hours worked per user for the specified date range
with total_hours_per_user as (
    select
        userName,
        sum(totalhours) as total_hours_worked
    from {{ ref('stg_timesheet') }}
    where startDate >= '2024-04-10' and endDate <= '2024-04-16'
    group by userName
)

-- Output the results
select * from total_hours_per_user
