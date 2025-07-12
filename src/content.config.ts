import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders'; // Not available with legacy API


const colleges = defineCollection({
  loader: file("src/data/colleges/colleges.json"),
  schema: z.object({
    id: z.string(),
    institution: z.object({
      name: z.string(),
      address: z.string(),
      phone: z.string(),
      website: z.string(),
      type: z.string(),
      awards_offered: z.array(z.string()),
      campus_setting: z.string(),
      campus_housing: z.boolean(),
      student_population: z.object({
        total: z.number(),
        undergraduate: z.number(),
        graduate: z.number(),
      }),
      student_faculty_ratio: z.string(),
      IPEDS_ID: z.string(),
      OPE_ID: z.string(),
    }),
    general_information: z.object({
      admissions_url: z.string(),
      apply_online_url: z.string(),
      financial_aid_url: z.string(),
      net_price_calculator_url: z.string(),
      disability_services_url: z.string(),
      mission_statement_url: z.string().nullable(),
    }),
    special_learning_opportunities: z.array(z.string()),
    student_services: z.array(z.string()),
    undergraduate_disability_services_percentage_fall_2023: z.number().nullable(),
    high_school_students_enrolled_2023_2024: z.number(),
    carnegie_classification: z.string(),
    religious_affiliation: z.string(),
    other_characteristics: z.array(z.string()),
    federal_aid: z.string(),
    for_credit_instruction_programs_offered: z.array(z.string()),
    noncredit_education_offered: z.array(z.string()),
    credit_accepted: z.array(z.string()),
    faculty_and_graduate_assistants_fall_2023: z.object({
      faculty: z.object({
        full_time_total: z.number(),
        part_time_total: z.number(),
        full_time_instructional: z.number(),
        part_time_instructional: z.number(),
        full_time_research_public_service: z.number(),
        part_time_research_public_service: z.number(),
      }),
      graduate_assistants: z.object({
        full_time: z.number().nullable(),
        part_time: z.number(),
      }),
    }),
    estimated_expenses: z.object({
      "2024-2025": z.object({
        tuition_and_fees: z.object({
          in_state: z.number(),
          out_of_state: z.number(),
          percent_change: z.number().nullable(),
        }),
        books_and_supplies: z.number(),
        living_arrangement: z.object({
          on_campus: z.object({
            food_and_housing: z.number(),
            other_expenses: z.number(),
          }).nullable(),
          off_campus: z.object({
            food_and_housing: z.number(),
            other_expenses: z.number(),
          }),
          off_campus_with_family: z.object({
            food_and_housing: z.number(),
            other_expenses: z.number(),
            percent_change_other_expenses: z.number().nullable(),
          }),
        }),
        total_expenses: z.object({
          in_state_on_campus: z.number().nullable(),
          in_state_off_campus: z.number(),
          in_state_off_campus_with_family: z.number(),
          out_of_state_on_campus: z.number().nullable(),
          out_of_state_off_campus: z.number(),
          out_of_state_off_campus_with_family: z.number(),
        }),
        percent_change_total_expenses_2023_2024_to_2024_2025: z.object({
          in_state_on_campus: z.number(),
          in_state_off_campus: z.number(),
          in_state_off_campus_with_family: z.number(),
          out_of_state_on_campus: z.number(),
          out_of_state_off_campus: z.number(),
          out_of_state_off_campus_with_family: z.number(),
        }).nullable(),
      }),
    }),
    completions_2023_2024: z.record(z.record(z.record(z.number()))).optional(),
  }),
});

export const collections = { colleges };