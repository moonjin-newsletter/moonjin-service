import Header from "../components/layout/Header";
import LoginModal from "../components/auth/LoginModal";
import * as process from "process";

export default function Page(): JSX.Element {
  console.log(process.env.NEXT_PUBLIC_SERVER_URL);
  return <main className=" w-full min-h-screen  ">메인화면</main>;
}
