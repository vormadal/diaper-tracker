import { differenceInHours, differenceInMinutes, format, isSameYear } from 'date-fns'

export const smartFormatDate = (date: Date): string => {
  const now = new Date()
  if (differenceInMinutes(now, date) < 1) return `just now`
  if (differenceInMinutes(now, date) < 60) return `${differenceInMinutes(now, date)} minutes ago`
  if (differenceInHours(now, date) < 24) return `${differenceInHours(now, date)} hours ago`

  if (isSameYear(now, date)) return format(date, 'dd. MMMM')

  return format(date, 'dd. MMMM yyyy')
}

export const inputFormatDate = (date?: Date | null): string => {
  if (!date) return ''
  const str = format(date, "yyyy-MM-dd'T'hh:mm")

  return str
}
