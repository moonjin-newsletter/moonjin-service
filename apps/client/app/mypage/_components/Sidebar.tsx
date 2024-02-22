import Link from "next/link";
import type { userType } from "../layout";

export function Sidebar({ type }: { type: userType }) {
  return (
    <nav className="flex flex-col">
      <Link href="" />
      <ul>
        <li>
          <Link href="">홈</Link>
        </li>
        <li>구독한 뉴스레터</li>
      </ul>
    </nav>
  );
}
