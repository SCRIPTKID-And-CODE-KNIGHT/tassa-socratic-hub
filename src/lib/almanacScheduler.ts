// Tanzania Public Holidays 2026
const HOLIDAYS_2026: string[] = [
  '2026-01-01', // New Year's Day
  '2026-01-12', // Zanzibar Revolution Day
  '2026-03-20', // Eid al-Fitr (estimated)
  '2026-03-21', // Eid al-Fitr Day 2 (estimated)
  '2026-04-03', // Good Friday
  '2026-04-06', // Easter Monday
  '2026-04-07', // Karume Day
  '2026-04-26', // Union Day
  '2026-05-01', // Labour Day
  '2026-05-27', // Eid al-Adha (estimated)
  '2026-05-28', // Eid al-Adha Day 2 (estimated)
  '2026-07-07', // Saba Saba Day
  '2026-08-08', // Nane Nane Day
  '2026-10-14', // Nyerere Day
  '2026-12-09', // Independence Day
  '2026-12-25', // Christmas Day
  '2026-12-26', // Boxing Day
];

export interface ScheduledEvent {
  event_name: string;
  event_start_date: string;
  event_end_date: string;
  responsible_person: string;
  description: string;
}

export interface SeriesSchedule {
  series_number: number;
  official_start_date: string;
  official_end_date: string;
  events: ScheduledEvent[];
}

// Event definitions with responsible persons
const EVENT_DEFINITIONS = [
  { name: 'Examination setting', responsible: 'Subject Coordinators', description: 'Setting of examination papers by subject experts' },
  { name: 'Submission of composed exams to the coordinator', responsible: 'Subject Coordinators', description: 'Submitting completed exam papers to the main coordinator' },
  { name: 'Moderation of exams', responsible: 'Moderation Committee', description: 'Quality assurance and moderation of examination papers' },
  { name: 'Returning of moderated exams to the coordinator', responsible: 'Moderation Committee', description: 'Returning approved exams after moderation' },
  { name: 'Supplying of exams to the participants', responsible: 'Distribution Team', description: 'Distribution of examination materials to participating schools' },
  { name: 'Starting of Exam (Paper 1)', responsible: 'Schools & Invigilators', description: 'Commencement of Paper 1 examination' },
  { name: 'Starting of Exam (Paper 2)', responsible: 'Schools & Invigilators', description: 'Commencement of Paper 2 examination' },
  { name: 'Marking and result submission to IT', responsible: 'Marking Team & IT', description: 'Marking of scripts and submission of results to IT department' },
  { name: 'Result processing', responsible: 'IT Department', description: 'Processing and compilation of examination results' },
  { name: 'Announcing results', responsible: 'TASSA Secretariat', description: 'Official announcement and publication of results' },
];

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Check if a date is a holiday
 */
function isHoliday(date: Date, holidays: string[]): boolean {
  const dateStr = formatDate(date);
  return holidays.includes(dateStr);
}

/**
 * Check if a date is a valid working day
 */
function isWorkingDay(date: Date, holidays: string[]): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays);
}

/**
 * Format date to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the next valid working day from a given date
 */
function getNextWorkingDay(date: Date, holidays: string[]): Date {
  const nextDay = new Date(date);
  while (!isWorkingDay(nextDay, holidays)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  return nextDay;
}

/**
 * Add N working days to a date
 */
function addWorkingDays(startDate: Date, days: number, holidays: string[]): Date {
  let current = new Date(startDate);
  let addedDays = 0;
  
  while (addedDays < days) {
    current.setDate(current.getDate() + 1);
    if (isWorkingDay(current, holidays)) {
      addedDays++;
    }
  }
  
  return current;
}

/**
 * Calculate the Nth working day from a start date (inclusive)
 * Day 1 = start date if it's a working day
 */
function getNthWorkingDay(startDate: Date, n: number, holidays: string[]): Date {
  let current = getNextWorkingDay(new Date(startDate), holidays);
  let count = 1;
  
  while (count < n) {
    current.setDate(current.getDate() + 1);
    if (isWorkingDay(current, holidays)) {
      count++;
    }
  }
  
  return current;
}

/**
 * Generate schedule for a single series
 */
export function generateSeriesSchedule(
  seriesNumber: number,
  examSettingStartDate: Date,
  officialStartDate: Date,
  holidays: string[] = HOLIDAYS_2026
): SeriesSchedule {
  const SERIES_WORKING_DAYS = 32;
  
  // Calculate official end date (32 working days from official start)
  const officialEndDate = getNthWorkingDay(officialStartDate, SERIES_WORKING_DAYS, holidays);
  
  // Event distribution:
  // Event 1 (Exam setting): Before official start (from examSettingStartDate)
  // Events 2-10: Distributed across the 32 working days
  
  // Calculate days for pre-start event (exam setting)
  const examSettingDays = 10; // 10 working days for exam setting
  const examSettingEnd = addWorkingDays(getNextWorkingDay(examSettingStartDate, holidays), examSettingDays - 1, holidays);
  
  // For remaining 9 events across 32 working days:
  // Divide into segments ensuring proper order and spacing
  const eventSpacing = [
    { startDay: 1, endDay: 3 },   // Submission: Days 1-3
    { startDay: 4, endDay: 6 },   // Moderation: Days 4-6
    { startDay: 7, endDay: 8 },   // Returning moderated: Days 7-8
    { startDay: 9, endDay: 12 },  // Supplying exams: Days 9-12
    { startDay: 13, endDay: 14 }, // Paper 1: Days 13-14
    { startDay: 15, endDay: 16 }, // Paper 2: Days 15-16
    { startDay: 17, endDay: 26 }, // Marking: Days 17-26
    { startDay: 27, endDay: 30 }, // Processing: Days 27-30
    { startDay: 32, endDay: 32 }, // Announcing: Day 32 (final day)
  ];
  
  const events: ScheduledEvent[] = [];
  
  // Event 1: Examination setting (before official start)
  events.push({
    event_name: EVENT_DEFINITIONS[0].name,
    event_start_date: formatDate(getNextWorkingDay(examSettingStartDate, holidays)),
    event_end_date: formatDate(examSettingEnd),
    responsible_person: EVENT_DEFINITIONS[0].responsible,
    description: EVENT_DEFINITIONS[0].description,
  });
  
  // Events 2-10: Within the 32 working days
  for (let i = 0; i < eventSpacing.length; i++) {
    const startDay = getNthWorkingDay(officialStartDate, eventSpacing[i].startDay, holidays);
    const endDay = getNthWorkingDay(officialStartDate, eventSpacing[i].endDay, holidays);
    
    events.push({
      event_name: EVENT_DEFINITIONS[i + 1].name,
      event_start_date: formatDate(startDay),
      event_end_date: formatDate(endDay),
      responsible_person: EVENT_DEFINITIONS[i + 1].responsible,
      description: EVENT_DEFINITIONS[i + 1].description,
    });
  }
  
  return {
    series_number: seriesNumber,
    official_start_date: formatDate(getNextWorkingDay(officialStartDate, holidays)),
    official_end_date: formatDate(officialEndDate),
    events,
  };
}

/**
 * Generate full almanac for Series 5-8
 */
export function generateFullAlmanac(holidays: string[] = HOLIDAYS_2026): SeriesSchedule[] {
  const SERIES_WORKING_DAYS = 32;
  const schedules: SeriesSchedule[] = [];
  
  // Series 5 specific dates
  const series5ExamSettingStart = new Date('2026-01-05');
  const series5OfficialStart = new Date('2026-01-21');
  
  // Generate Series 5
  const series5 = generateSeriesSchedule(5, series5ExamSettingStart, series5OfficialStart, holidays);
  schedules.push(series5);
  
  // Series 6, 7, 8: Each starts the working day after the previous series ends
  let previousEndDate = new Date(series5.official_end_date);
  
  for (let seriesNum = 6; seriesNum <= 8; seriesNum++) {
    // Next series exam setting starts 10 working days before official start
    // Official start is the next working day after previous series ends
    const nextOfficialStart = addWorkingDays(previousEndDate, 1, holidays);
    
    // Exam setting starts ~10 working days before official start
    // We calculate backward: subtract ~16 calendar days to approximate
    const examSettingStart = new Date(nextOfficialStart);
    examSettingStart.setDate(examSettingStart.getDate() - 16);
    
    const series = generateSeriesSchedule(seriesNum, examSettingStart, nextOfficialStart, holidays);
    schedules.push(series);
    
    previousEndDate = new Date(series.official_end_date);
  }
  
  return schedules;
}

/**
 * Get holidays list
 */
export function getHolidays2026(): string[] {
  return [...HOLIDAYS_2026];
}

/**
 * Format date for display
 */
export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
