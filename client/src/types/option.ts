interface IOption {
  label: string;
  value: string;
}
const TypeOptions = [
  {
    label: "Text",
    value: "text",
  },
  {
    label: "Rating",
    value: "rating",
  },
];

const yearOptions: IOption[] = [
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
  { label: "2030", value: "2030" },
  { label: "2031", value: "2031" },
  { label: "2032", value: "2032" },
  { label: "2033", value: "2033" },
  { label: "2034", value: "2034" },
  { label: "2035", value: "2035" },
];

const monthOptions: IOption[] = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const quarterOptions: IOption[] = [
  { label: "Q1", value: "Q1" },
  { label: "Q2", value: "Q2" },
  { label: "Q3", value: "Q3" },
  { label: "Q4", value: "Q4" },
];

const isEnabledOptions: IOption[] = [
  { label: "Enabled", value: "enabled" },
  { label: "Disabled", value: "disabled" },
];
export default IOption;

export {
  TypeOptions,
  yearOptions,
  monthOptions,
  quarterOptions,
  isEnabledOptions,
};
