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

const currentYear = new Date().getFullYear();
const yearOptions: IOption[] = Array.from({ length: 5 }, (_, i) => {
  const year = (currentYear - i).toString();
  return { label: year, value: year };
});

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
