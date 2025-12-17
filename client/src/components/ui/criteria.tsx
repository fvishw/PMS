interface ICriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
}

const Criteria: React.FC<ICriteria> = ({ id, name, description, weight }) => {
  return (
    <div
      className="border p-4 rounded-md mb-4 flex justify-between items-center"
      key={id}
    >
      <div>
        <h3 className="text-sm">{name}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <span>
        <p className="md:pr-4 sm:px-2 text-sm">{weight} %</p>
      </span>
    </div>
  );
};

export default Criteria;
