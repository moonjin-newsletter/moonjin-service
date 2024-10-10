// import Header from "@components/layout/Header";
// import Footer from "@components/layout/Footer";
// import HeadTitle from "./_static/Head-title.svg";
// import ThirdTtile from "./_static/Third-title.svg";
// import Link from "next/link";
// import { LogoSymbolGray } from "@components/icons";
//
// export default function Page() {
//   return (
//     <>
//       <Header />
//       <main className="w-full min-h-screen scroll-smooth">
//         <section className="w-full flex flex-col items-center justify-center bg-black min-h-screen ">
//           <div className="w-fit animate-fade">
//             <HeadTitle className="" />
//             <hr className="w-full border-b border-grayscale-200 " />
//             <p className={`text-white text-lg text-center font-serif mt-8`}>
//               모든 것이 쉽고 빠르게 소비되는 세상 속 당신의 하루는 어떠셨나요?
//               <br />
//               <br />
//               문진은 항상 사람들이 놓치고 있는 과거의 기억, 현재의 생각,
//               <br />
//               그리고 미래의 꿈을 놓치지 않길 바랐습니다.
//             </p>
//           </div>
//         </section>
//         <section className="w-full flex py-[72px] justify-center bg-primary text-white ">
//           <p className="font-serif text-2xl  leading-relaxed">
//             기억, 생각, 꿈<br />
//             모든 이야기의 공간
//           </p>
//           <hr className="w-[398px] border-white my-4 mr-5" />
//           <p className="font-serif 	leading-relaxed">
//             그래서 우리는 기억, 생각, 꿈 속의 이야기를
//             <br />
//             기록하고 나누는 공간이 필요하다고 생각했습니다.
//             <br />
//             <br />
//             <br />
//             문진은 단순한 뉴스레터를 넘어서,
//             <br />
//             글이 가진 힘과 가치를 다시 일깨우고
//             <br />
//             기억하게 하는 공간이 되기 위해 만들어졌습니다.
//           </p>
//         </section>
//         <section className="w-full py-20 bg-white flex flex-col items-center relative overflow-hidden">
//           <ThirdTtile />
//           <p className="font-serif text-lg text-grayscale-600 text-center mt-6 leading-relaxed">
//             ‘문진’은 책이나 종이가 바람에 날리지 않도록 눌러두는 물건입니다.
//             <br />
//             문진은 바쁘게 흘러가는 삶을 잠시 눌러두고 멈추어서 고민하고 사색할
//             수 있는 공간입니다.
//             <br />
//             문진을 통해 어제를 오늘을 그리고 내일의 이야기를 기록하고 나눌 수
//             있습니다.
//             <br />
//           </p>
//           <div className="w-full">
//             <div></div>
//             <div className="max-w-[1006px]"></div>
//             <div></div>
//           </div>
//         </section>
//         <section className="bg-grayscale-700 py-20"></section>
//         <section className="w-full flex flex-col items-center text-grayscale-700 border-grayscale-400 leading-relaxed break-keep">
//           <div className="w-full max-w-[1006px] h-full border-x ">
//             <div className="flex px-12 w-full justify-center pt-20 pb-10 border-b">
//               <div className="flex flex-col">
//                 <p className="font-serif text-xl  leading-relaxed whitespace-nowrap">
//                   지금 바로 작가가 되어
//                   <br />
//                   뉴스레터를 작성해보세요.
//                 </p>
//                 <Link
//                   href="/auth/signup"
//                   className="mt-12 bg-grayscale-600 text-white py-2.5 px-6 rounded w-fit flex items-center gap-2"
//                 >
//                   <LogoSymbolGray />
//                   작가 시작하기
//                 </Link>
//               </div>
//               <hr className="w-[398px] border-grayscale-600 my-4 mr-5" />
//               <p className="font-serif 	leading-relaxed">
//                 여러분의 지식, 일상과 경험을 문진에 담아보세요.
//                 <br />
//                 문진에서 다양한 독자들과 연결되어, 당신만의 이야기를 공유하며 더
//                 많은 사람들에게 영감을 줄 수 있습니다. 지금 시작하세요, 당신의
//                 이야기가 누군가의 내일을 바꿀 수 있습니다.
//               </p>
//             </div>
//             <div className="flex px-12 w-full justify-center pt-16 pb-10 border-b mb-10">
//               <div className="flex flex-col">
//                 <p className="font-serif text-xl  leading-relaxed whitespace-nowrap">
//                   다양한 분야의 지식과
//                   <br />
//                   이야기를 지금 바로 읽어보세요.
//                 </p>
//                 <Link
//                   href="/newsletter"
//                   className="mt-12 bg-primary text-white py-2.5 px-6 rounded w-fit flex items-center gap-2"
//                 >
//                   <LogoSymbolGray />
//                   뉴스레터 구독하기
//                 </Link>
//               </div>
//               <hr className="w-[398px] border-grayscale-600 my-4 mr-5" />
//               <p className="font-serif 	leading-relaxed">
//                 한정된 주제가 아닌 다양한 분야의 뉴스레터를 통해 폭넓은 지식과
//                 트렌드를 쉽게 접할 수 있습니다. 일상적인 이야기부터 전문적인
//                 정보까지, 구독자들은 다양한 관점을 배울 수 있습니다.
//               </p>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </>
//   );
// }
