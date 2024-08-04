import { cookies } from "next/headers";

export default function checkLogin() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  return accessToken ? true : false;
}
