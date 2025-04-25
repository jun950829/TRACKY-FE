import { Member } from "@/constants/types/types";
import { UpdateMemberRequestType } from "@/libs/apis/signupApi";

export const convertMemberToUpdateRequest = (member: Member): UpdateMemberRequestType => {
  return {
    memberId: member.memberId,
    bizName: member.bizName,
    bizRegNum: member.bizRegNum,
    bizAdmin: member.bizAdmin,
    bizPhoneNum: member.bizPhoneNum,
    email: member.email,
    role: member.role,
    status: member.status,
  };
};