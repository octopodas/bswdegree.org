import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders'; // Not available with legacy API


const colleges = defineCollection({
  loader: file("src/data/colleges/colleges.json", {
    parser: (text) => {
      const data = JSON.parse(text);
      // Filter out items without id or slug
      return Array.isArray(data) ? data.filter(item => item.id || item.slug) : data;
    }
  }),
  schema: z.object({
    id: z.string().optional(),
    institution: z.object({
      name: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
      website: z.string().optional(),
      type: z.string().optional(),
      awards_offered: z.array(z.string()).optional(),
      campus_setting: z.string().optional(),
      campus_housing: z.boolean().optional(),
      student_population: z.object({
        total: z.number().nullable().optional(),
        undergraduate: z.number().nullable().optional(),
        graduate: z.number().nullable().optional(),
      }).optional(),
      student_faculty_ratio: z.string().nullable().optional(),
      IPEDS_ID: z.string().optional(),
      OPE_ID: z.string().nullable().optional(),
    }).optional(),
    general_information: z.object({
      admissions_url: z.string().nullable().optional(),
      apply_online_url: z.string().nullable().optional(),
      financial_aid_url: z.string().nullable().optional(),
      net_price_calculator_url: z.string().nullable().optional(),
      disability_services_url: z.string().optional(),
      mission_statement_url: z.string().nullable().optional(),
    }).optional(),
    special_learning_opportunities: z.array(z.string()).nullable().optional(),
    student_services: z.array(z.string()).optional(),
    undergraduate_disability_services_percentage_fall_2023: z.union([z.number(), z.string()]).nullable().optional(),
    high_school_students_enrolled_2023_2024: z.number().nullable().optional(),
    carnegie_classification: z.string().optional(),
    religious_affiliation: z.string().optional(),
    other_characteristics: z.array(z.string()).nullable().optional(),
    federal_aid: z.string().optional(),
    for_credit_instruction_programs_offered: z.array(z.string()).optional(),
    noncredit_education_offered: z.array(z.string()).nullable().optional(),
    credit_accepted: z.array(z.string()).nullable().optional(),
    faculty_and_graduate_assistants_fall_2023: z.object({
      faculty: z.object({
        full_time_total: z.number().nullable().optional(),
        part_time_total: z.number().nullable().optional(),
        full_time_instructional: z.number().nullable().optional(),
        part_time_instructional: z.number().nullable().optional(),
        full_time_research_public_service: z.number().nullable().optional(),
        part_time_research_public_service: z.number().nullable().optional(),
      }),
      graduate_assistants: z.object({
        full_time: z.number().nullable().optional(),
        part_time: z.number().nullable().optional(),
      }).nullable(),
    }).nullable().optional(),
    estimated_expenses: z.object({
      "2024-2025": z.object({
        tuition_and_fees: z.union([
          z.object({
            in_district: z.number().nullable().optional(),
            in_state: z.number().nullable().optional(),
            out_of_state: z.number().nullable().optional(),
            percent_change: z.union([
              z.number().nullable(),
              z.object({
                in_district: z.number().nullable().optional(),
                in_state: z.number().nullable().optional(),
                out_of_state: z.number().nullable().optional(),
              })
            ]).optional(),
          }),
          z.number()
        ]).optional(),
        books_and_supplies: z.number().nullable().optional(),
        living_arrangement: z.object({
          on_campus: z.object({
            food_and_housing: z.number().nullable(),
            other_expenses: z.number().nullable(),
          }).nullable().optional(),
          off_campus: z.object({
            food_and_housing: z.number().nullable().optional(),
            other_expenses: z.number().nullable().optional(),
          }).nullable(),
          off_campus_with_family: z.object({
            food_and_housing: z.number().nullable(),
            other_expenses: z.number().nullable(),
            percent_change_other_expenses: z.number().nullable().optional(),
          }).nullable().optional(),
        }).nullable().optional(),
        total_expenses: z.object({
          in_district_off_campus: z.number().nullable().optional(),
          in_district_off_campus_with_family: z.number().nullable().optional(),
          in_state_on_campus: z.number().nullable().optional(),
          in_state_off_campus: z.number().nullable().optional(),
          in_state_off_campus_with_family: z.number().nullable().optional(),
          out_of_state_on_campus: z.number().nullable().optional(),
          out_of_state_off_campus: z.number().nullable().optional(),
          out_of_state_off_campus_with_family: z.number().nullable().optional(),
        }).nullable().optional(),
        percent_change_total_expenses_2023_2024_to_2024_2025: z.object({
          in_district_off_campus: z.number().nullable().optional(),
          in_district_off_campus_with_family: z.number().nullable().optional(),
          in_state_on_campus: z.number().nullable().optional(),
          in_state_off_campus: z.number().nullable().optional(),
          in_state_off_campus_with_family: z.number().nullable().optional(),
          out_of_state_on_campus: z.number().nullable().optional(),
          out_of_state_off_campus: z.number().nullable().optional(),
          out_of_state_off_campus_with_family: z.number().nullable().optional(),
        }).nullable().optional(),
      }).optional(),
    }).nullable().optional(),
    multiyear_tuition_calculator: z.object({
      undergraduate_student_average_2024_2025: z.object({
        in_district_tuition_and_fees: z.number().optional(),
        in_state_tuition_and_fees: z.number().optional(),
        out_of_state_tuition_and_fees: z.number().optional(),
      }).optional(),
    }).nullable().optional(),
    completions_2023_2024: z.record(z.record(z.record(z.union([z.number(), z.boolean()]).nullable()))).nullable().optional(),
  }),
});

export const collections = { colleges };