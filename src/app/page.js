import { Blocks, BriefcaseBusiness, Link } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className='bg-primary w-full h-full '>
      <div className='flex flex-col items-center justify-center gap-10 pt-40 px-[80px] pb-[250px] '>
      <h1 className='text-primary text-4xl text-white'>Welcome, Dear Admin choose what you want to control</h1>
      <div className='flex items-center gap-10'>
        <Link href='/dashboard/categories' className='bg-white text-primary p-2 rounded-lg flex items-center justify-evenly gap-2'>
        <Blocks/>
        Categories
        </Link>
        <Link href='/dashboard/businesses' className='bg-white text-primary p-2 rounded-lg  flex items-center justify-evenly gap-2'>
        <BriefcaseBusiness/> 
          Businesses 
        </Link>
      </div>
      </div>
    </div>
  );
}
