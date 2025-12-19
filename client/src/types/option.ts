interface IOption {
  label: string;
  value: string;
}
const TypeOptions = [
  {
    label: "String",
    value: "string",
  },
  {
    label: "Rating",
    value: "rating",
  },
];

export default IOption;

export { TypeOptions };
