/**
 *
 * @param date
 * @param locale the locale i.e. it-IT
 */
export function convertDate(date: Date, locale: string = "it-IT") {
  return `${new Intl.DateTimeFormat(locale, {
    timeStyle: "medium",
    dateStyle: "short",
  }).format(date)}`;
}
