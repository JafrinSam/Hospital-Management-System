// This mock data is shared by both the list and detail screens.
export const MOCK_PRESCRIPTIONS = [
  {
    id: 'rx001',
    date: 'October 20, 2025',
    diagnosis: 'Seasonal Flu',
    doctor: 'Dr. Anil Sharma',
    medications: [
      { name: 'Oseltamivir (Tamiflu)', dosage: '75mg', frequency: 'Twice a day for 5 days' },
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed for fever' },
    ],
    notes: 'Rest for 3 days and drink plenty of fluids. Avoid contact with others.',
  },
  {
    id: 'rx002',
    date: 'September 12, 2025',
    diagnosis: 'High Blood Pressure',
    doctor: 'Dr. Meena Gupta',
    medications: [{ name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily in the morning' }],
    notes: 'Monitor blood pressure weekly. Follow up in 1 month. Reduce salt intake.',
  },
  {
    id: 'rx003',
    date: 'August 02, 2025',
    diagnosis: 'Bacterial Infection',
    doctor: 'Dr. Anil Sharma',
    medications: [{ name: 'Amoxicillin', dosage: '500mg', frequency: 'Every 8 hours for 7 days' }],
    notes: 'Finish the entire course of antibiotics, even if you feel better.',
  },
];
