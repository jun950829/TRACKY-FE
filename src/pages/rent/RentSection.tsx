import { rentApiService } from "@/libs/apis/rentsApi";
import { useEffect, useState } from "react";
import RentTable from "./RentTable";
import RentSearchLayer from "./RentSearchLayer";
import { CarDetailTypes, RentDetailTypes } from "@/constants/types";

function RentSection() {
    const [rentList, setRentList] = useState<RentDetailTypes[]>([]);

    async function getRents() {
        const res = await rentApiService.getRents();
        console.log('getRents: ', res.data);
        setRentList(res.data);
    }

    async function searchRents(searchText: string) {
        const res = await rentApiService.searchByRentUuid(searchText);
        console.log('searchRents: ', res);
        setRentList(res.data);
    }

    useEffect(() => {
        getRents();
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center px-6">
          <RentSearchLayer onSearch={searchRents} />
          <RentTable rentList={rentList} setRentList={setRentList} />
        </div>
      );
    }
    
    export default RentSection;