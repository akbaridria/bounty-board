import Bounty from "./bounty";

const ListBounties = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2">
      {Array.from({ length: 100 }, (_, index) => (
        <Bounty key={index} />
      ))}
    </div>
  );
};

export default ListBounties;
