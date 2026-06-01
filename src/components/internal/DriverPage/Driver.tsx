import Navbar from "../Navbar";

const Driver = () => {
  return (
    <div className="flex">
      <Navbar role_id={4} />
      <div className="flex flex-col gap-3 p-3 w-[85%] bg-red-200">
        <div className="w-full flex gap-3">
          <div className="flex-1 bg-blue-200">
            <b>Data SPPG</b>
          </div>
          <div className="flex-1 bg-blue-200">
            <b>Pengiriman Hari Ini</b>
          </div>
          <div className="flex-1 bg-blue-200">
            <b>History Pengiriman</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Driver;
