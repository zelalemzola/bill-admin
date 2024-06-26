import { Blocks, BriefcaseBusiness, Link } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className='bg-primary w-full h-full '>
      <div className='flex flex-col items-center justify-center gap-10 pt-40 px-[80px] pb-[250px] '>
      <h1 className='text-primary text-4xl text-white'>Welcome, Dear Admin choose what you want to control</h1>
      <div className='pt-6'>
          <Link href="/dashboard" className="bg-primary text-white -2 rounded-lg">Go To Dashboard</Link>
      </div>
      </div>
    </div>
  );
}
