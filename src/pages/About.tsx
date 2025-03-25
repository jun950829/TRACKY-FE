import { useState } from "react";
import Button from "../components/common/Button";
import bizApiService from "../libs/apis/bizApi";

type BIZ = {
  biz_admin : string;
  biz_name: string;
  biz_phone_num: string;
  biz_reg_num: string;
}

function About() {
  const [bizs, setBizs] = useState<BIZ[]>([]);

  async function getAllbiz() {
    const result = await bizApiService.getBizs();
    console.log(result);
    setBizs(result);
  }

  return (
    <div>
      <h1>api test</h1>
      <h1 className="text-3xl font-bold text-center">ℹ️ About Page</h1>

      <Button label="api test" size="md" onClick={getAllbiz} />
      {bizs.map((biz: BIZ , index: number) => {
        return <div key={index}>{biz.biz_admin}/ {biz.biz_name} / {biz.biz_phone_num} / {biz.biz_reg_num} </div>
      })}
    </div>
  )
}

export default About;
