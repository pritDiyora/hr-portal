let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'sickleave' + ' reason :Fever',
    start: todayStr,
    end: "2020-10-15",
    reason: 'Fever',
  },
  {
    id: createEventId(),
    title: 'earn Leave',
    start: todayStr,
    end: "2020-10-18",
    reason: 'Family event',
  }
]


export function createEventId() {
  return String(eventGuid++)
}