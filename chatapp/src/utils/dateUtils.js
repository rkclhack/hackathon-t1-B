export const convertToJST = (datetimeString) => {
  const utcDate = new Date(datetimeString.replace(" ", "T"))
  const jstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000)

  const yyyy = jstDate.getFullYear()
  const mm = String(jstDate.getMonth() + 1).padStart(2, "0")
  const dd = String(jstDate.getDate()).padStart(2, "0")
  const hh = String(jstDate.getHours()).padStart(2, "0")
  const min = String(jstDate.getMinutes()).padStart(2, "0")

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}