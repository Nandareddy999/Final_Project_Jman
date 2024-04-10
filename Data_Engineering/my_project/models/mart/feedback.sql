{{ config(
  materialized='table',
  schema='Mart'
) }}

with Feedback AS(
  select sf.username,sq.questions,sf.ratings,sf.feedback from {{ref('stg_feedback')}} sf join  {{ref("stg_questions")}} sq
on 
sq._id=sf.questionid
)
select * from Feedback