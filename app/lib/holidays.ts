/**
 * Public holidays from Nager.Date — an open-source, key-free holiday API.
 * https://date.nager.at
 *
 * Fetched on the server and cached for a day: holiday tables change rarely,
 * and this keeps the upstream service out of the request path for every view.
 */

const BASE = 'https://date.nager.at/api/v3'
const REVALIDATE = 60 * 60 * 24

/**
 * Countries Nager.Date doesn't cover, served instead from Google's public
 * holiday calendars — also keyless and open. Those feeds include observances
 * as well as gazetted holidays, which is flagged in the UI.
 */
const EXTRA_COUNTRIES: Record<string, { name: string; calendar: string }> = {
  IN: { name: 'India', calendar: 'indian' },
  AE: { name: 'United Arab Emirates', calendar: 'ae' },
  SA: { name: 'Saudi Arabia', calendar: 'saudiarabian' },
  PK: { name: 'Pakistan', calendar: 'pk' },
  TH: { name: 'Thailand', calendar: 'th' },
  MY: { name: 'Malaysia', calendar: 'malaysia' },
  IL: { name: 'Israel', calendar: 'jewish' },
  VN: { name: 'Vietnam', calendar: 'vietnamese' },
}

export function isExtraCountry(code: string) {
  return code in EXTRA_COUNTRIES
}

/** Unfold ICS continuation lines, then pull out the dated events. */
function parseIcs(text: string, year: number): Holiday[] {
  const unfolded = text.replace(/\r?\n[ \t]/g, '')
  const out: Holiday[] = []
  for (const block of unfolded.split('BEGIN:VEVENT').slice(1)) {
    const date = /DTSTART;VALUE=DATE:(\d{4})(\d{2})(\d{2})/.exec(block)
    const name = /SUMMARY:(.*)/.exec(block)
    if (!date || !name) continue
    if (date[1] !== String(year)) continue
    const label = name[1].trim()
    out.push({
      date: `${date[1]}-${date[2]}-${date[3]}`,
      localName: label,
      name: label,
      global: true,
      counties: null,
      types: ['Public'],
    })
  }
  // A feed can list the same day twice; keep one of each date+name.
  const seen = new Set<string>()
  return out
    .filter((h) => {
      const key = `${h.date}|${h.name}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

async function getIcsHolidays(year: number, code: string) {
  const entry = EXTRA_COUNTRIES[code]
  if (!entry) return null
  const url = `https://calendar.google.com/calendar/ical/en.${entry.calendar}%23holiday%40group.v.calendar.google.com/public/basic.ics`
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } })
    if (!res.ok) return null
    return parseIcs(await res.text(), year)
  } catch {
    return null
  }
}

export type Country = { countryCode: string; name: string }

export type Holiday = {
  date: string
  localName: string
  name: string
  /** True when it applies nationwide. */
  global: boolean
  /** ISO subdivision codes, e.g. ['GB-SCT']. Null when global. */
  counties: string[] | null
  types: string[]
}

/** Names for the subdivision codes the API returns as bare ISO codes. */
const REGION_NAMES: Record<string, string> = {
  'GB-ENG': 'England', 'GB-NIR': 'Northern Ireland',
  'GB-SCT': 'Scotland', 'GB-WLS': 'Wales',
  'US-AL': 'Alabama', 'US-AK': 'Alaska', 'US-AZ': 'Arizona', 'US-CA': 'California',
  'US-CO': 'Colorado', 'US-FL': 'Florida', 'US-GA': 'Georgia', 'US-HI': 'Hawaii',
  'US-IL': 'Illinois', 'US-NY': 'New York', 'US-TX': 'Texas', 'US-WA': 'Washington',
  'DE-BY': 'Bavaria', 'DE-BE': 'Berlin', 'DE-NW': 'North Rhine-Westphalia',
  'CA-AB': 'Alberta', 'CA-BC': 'British Columbia', 'CA-ON': 'Ontario', 'CA-QC': 'Quebec',
  'AU-NSW': 'New South Wales', 'AU-QLD': 'Queensland', 'AU-VIC': 'Victoria',
  'ES-CT': 'Catalonia', 'ES-MD': 'Madrid', 'IT-BZ': 'South Tyrol',
  'CH-ZH': 'Zurich', 'AT-9': 'Vienna', 'FR-67': 'Bas-Rhin',
}

export function regionName(code: string) {
  return REGION_NAMES[code] ?? code
}

export async function getCountries(): Promise<Country[]> {
  const extras = Object.entries(EXTRA_COUNTRIES).map(([countryCode, v]) => ({
    countryCode,
    name: v.name,
  }))
  try {
    const res = await fetch(`${BASE}/AvailableCountries`, {
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return extras.sort((a, b) => a.name.localeCompare(b.name))
    const base = (await res.json()) as Country[]
    const have = new Set(base.map((c) => c.countryCode))
    return [...base, ...extras.filter((e) => !have.has(e.countryCode))].sort(
      (a, b) => a.name.localeCompare(b.name)
    )
  } catch {
    // Upstream unavailable — still offer the countries we serve ourselves.
    return extras.sort((a, b) => a.name.localeCompare(b.name))
  }
}

export async function getHolidays(
  year: number,
  countryCode: string
): Promise<Holiday[] | null> {
  if (isExtraCountry(countryCode)) return getIcsHolidays(year, countryCode)
  try {
    const res = await fetch(`${BASE}/PublicHolidays/${year}/${countryCode}`, {
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return null
    return (await res.json()) as Holiday[]
  } catch {
    return null
  }
}

/** Subdivision codes that appear in a country's holiday table. */
export function regionsOf(holidays: Holiday[]): string[] {
  return [...new Set(holidays.flatMap((h) => h.counties ?? []))].sort()
}

/** Nationwide holidays, plus those for the chosen region. */
export function forRegion(holidays: Holiday[], region: string | null) {
  if (!region) return holidays.filter((h) => h.global)
  return holidays.filter((h) => h.global || h.counties?.includes(region))
}
