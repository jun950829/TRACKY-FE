import { rentApiService } from "@/libs/apis/rentsApi";
import { useEffect, useState } from "react";

function RentSection() {
    const [rentList, setRentList] = useState([]);

    async function getRents() {
        const res = await rentApiService.getRents();
        console.log('getRents: ', res.data);
        setRentList(res.data);
    }

    async function searchRents(searchText: string) {
        const res = await rentApiService.searchByUuid(searchText);
        console.log('searchRents: ', res);
        setRentList(res.data);
    }

    useEffect(() => {
        getRents();
    }, []);

    return (
        // <div className="w-full h-full flex flex-col items-center justify-center px-6">
        //   <RentSearchLayer onSearch={searchRents} />
        //   <RentTable rentList={rentList} />
        // </div>
        <div></div>
      );
    }
    
    export default RentSection;