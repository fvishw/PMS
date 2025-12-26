interface ICriteria {
  id: string;
  objective: string;
  indicator: string;
  weight: number;
}

const Criteria: React.FC<ICriteria> = ({
  id,
  objective,
  indicator,
  weight,
}) => {
  return (
    <div
      className="border p-4 rounded-md mb-4 flex justify-between items-center"
      key={id}
    >
      <div>
        <h3 className="text-sm">{objective}</h3>
        <p className="text-gray-500 text-sm">{indicator}</p>
      </div>
      <span>
        <p className="md:pr-4 sm:px-2 text-sm">{weight} %</p>
      </span>
    </div>
  );
};

export default Criteria;
