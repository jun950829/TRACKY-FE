import { useEffect, useState } from "react";
import CarSearchLayer from "./CarSearchLayer";
import CarTable from "./CarTable";
import carApiService from "@/libs/apis/carApi";

function CarSection() {
  const [carList, setCarList] = useState([]);

  async function getCars() {
    const res = await carApiService.getCars();
    console.log('getCars: ', res);
    setCarList(res);
  }

  async function searchCars(searchText: string) {
    const res = await carApiService.searchByMdn(searchText);
    console.log('searchCars :', res);
    setCarList(res);
  } 

  useEffect(() => {
    getCars();
  }, []);


  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6">
      <CarSearchLayer onSearch={searchCars} />
      <CarTable carList={carList} />
    </div>
  );
}

export default CarSection;