import Bounty from "./bounty";

const ListBounties = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
      {Array.from({ length: 10 }, (_, index) => (
        <Bounty key={index} index={index} />
      ))}
    </div>
  );
};

export default ListBounties;
