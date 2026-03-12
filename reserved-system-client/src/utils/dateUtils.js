/**
 * Helper function for convert from Date to Array [YYYY,MM,DD,HH,mm]
 */
export const dateToArray = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return null;
  return [
    date.getFullYear(),
    date.getMonth() + 1, // měsíce jsou 0–11
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
};

/**
 *  Convert from Array [YYYY, MM, DD, HH, mm] to Date
 */
export const arrayToDate = (arr) => {
  if (!Array.isArray(arr) || arr.length < 5) return null;
  const [year, month, day, hour, minute] = arr;
  return new Date(year, month - 1, day, hour, minute);
};

 // Helper function for convert from Date to String for Input field [type=datetime-local]
  export const formatDateTimeLocal = (date) => {
    if (!date) return "";
    const pad = (n) => n.toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  };

 // Date format for table
 export const formatTime = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const pad = (n) => n.toString().padStart(2, "0");

      return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
 }


 export const inputToArray = (value) => {
  if (!value) return null;
  const [date, time] = value.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return [year, month, day, hour, minute];
};