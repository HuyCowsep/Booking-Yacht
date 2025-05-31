import React from "react";
import { useSelector } from "react-redux";
import {
  FaAnchor,
  FaBed,
  FaShip,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

function BoatInfo() {
  const yacht = useSelector((state) => state.yacht.currentYacht);

  if (!yacht) {
    return <div>Loading...</div>;
  }

  return (
    <div className="md:w-4/12">
      <div className="mx-auto border shadow-md rounded-3xl light:bg-gray-100 p-6 relative overflow-hidden">
        <h3 className="text-xl font-bold text-center !font-archivo light:text-gray-800 dark:text.primary mb-6">
          Thông tin du thuyền
        </h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 items-center">
            <div className="flex items-center gap-2">
              <FaAnchor className="light:text-gray-600" size={22} />
              <p className="font-normal light:text-gray-600 text-base">
                Hạ thủy
              </p>
            </div>
            <p className="light:text-gray-900 font-medium text-base">
              {yacht.launch}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <div className="flex items-center gap-2">
              <FaBed className="light:text-gray-600" size={22} />
              <p className="font-normal light:text-gray-600 text-base">Cabin</p>
            </div>
            <p className="light:text-gray-900 font-medium text-base">20</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <div className="flex items-center gap-2">
              <FaShip className="light:text-gray-600" size={22} />
              <p className="font-normal light:text-gray-600 text-base">
                Thân vỏ
              </p>
            </div>
            <p className="light:text-gray-900 font-medium text-base">
              {yacht.hullBody}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="light:text-gray-600" size={22} />
              <p className="font-normal light:text-gray-600 text-base">
                Hành trình
              </p>
            </div>
            <p className="light:text-gray-900 font-medium text-base">
              {yacht.itinerary}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <div className="flex items-center gap-2">
              <FaBuilding className="light:text-gray-600" size={22} />
              <p className="font-normal light:text-gray-600 text-base">
                Điều hành
              </p>
            </div>
            <p className="light:text-gray-900 font-medium text-base">
              {yacht.IdCompanys.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoatInfo;
