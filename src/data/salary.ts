import type { SalaryDataItem } from '../types';

export const salaryData: SalaryDataItem[] = [
  {
    label: 'Healthcare (Hospitals)',
    value: 72030,
    color: 'rgba(5, 150, 105, 0.7)'
  },
  {
    label: 'Child/Family (Schools)',
    value: 62920,
    color: 'rgba(5, 150, 105, 0.7)'
  },
  {
    label: 'Mental Health/Substance Abuse',
    value: 68290,
    color: 'rgba(5, 150, 105, 0.7)'
  },
  {
    label: 'Child/Family (Govt)',
    value: 51270,
    color: 'rgba(5, 150, 105, 0.7)'
  },
  {
    label: 'Individual & Family Services',
    value: 43940,
    color: 'rgba(5, 150, 105, 0.7)'
  }
];

export const chartConfig = {
  backgroundColor: 'rgba(5, 150, 105, 0.7)',
  borderColor: 'rgba(4, 120, 87, 1)',
  borderWidth: 1
};