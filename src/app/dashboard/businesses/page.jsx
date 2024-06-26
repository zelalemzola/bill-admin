"use client"
// pages/dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadDropzone } from '@uploadthing/react';
import { UploadButton } from '../../../utils/uploadthing';
import { Check, ChevronsUpDown, Ellipsis, Search } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, PlusCircle, PlusCircleIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Textarea } from '@/components/ui/textarea';

const Businesses = () => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [searchBusiness,setSearchBusiness] = useState('');
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    category: '',
    bannerImageUrl:'',
    bannerImageFile:"",
    locations: [{ address: '', contact: '' }],
    details: '',
  });
  const [editingBusiness, setEditingBusiness] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchBusinesses();
  }, []);
  
  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');
    setCategories(response.data.categories);
    console.log(categories)
  };

  const fetchBusinesses = async () => {
    const response = await axios.get('/api/businesses');
    setBusinesses(response.data.businesses);
  };
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setNewBusiness({ ...newBusiness, [name]: value });
  };

  const handleLocationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLocations = newBusiness.locations.map((location, i) =>
      i === index ? { ...location, [name]: value } : location
    );
    setNewBusiness({ ...newBusiness, locations: updatedLocations });
  };
  const addBusiness = async () => {
    if (editingBusiness) {
      const response = await axios.put(`/api/businesses/${editingBusiness._id}`, newBusiness);
      setBusinesses(businesses.map(bus => bus._id === editingBusiness._id ? response.data.business : bus));
      setEditingBusiness(null);
    } else {
      const response = await axios.post('/api/businesses', newBusiness);
      setBusinesses([...businesses, response.data.business]);
    }
    setNewBusiness({
      name: '',
      category: '',
      bannerImageUrl: '',
      bannerImageKey: '',
      locations: [{ address: '', contact: '' }],
      details: '',
    });
  };
  const editBusiness = (business) => {
    setNewBusiness({
      name: business.name,
      category: business.category._id,
      bannerImageUrl: business.bannerImageUrl,
      bannerImageKey: business.bannerImageKey,
      locations: business.locations,
      details: business.details,
    });
    setEditingBusiness(business);
  };


  const deleteBusiness = async (id) => {
    await axios.delete(`/api/businesses/${id}`);
    setBusinesses(businesses.filter(business => business._id !== id));
  };

  const addLocationField = () => {
    setNewBusiness({
      ...newBusiness,
      locations: [...newBusiness.locations, { address: '', contact: '' }],
    });
  };

  const removeLocationField = (index) => {
    setNewBusiness({
      ...newBusiness,
      locations: newBusiness.locations.filter((_, i) => i !== index),
    });
  };
  return (
    <div>
      <div className='fixed bg-white border-b border-b-2 p-2 w-full z-30  px-4 flex gap-40'>
      <Dialog >
  <DialogTrigger>
       <div className='flex items-center justify-between gap-10 rounded-sm p-2 bg-primary'>
        <PlusCircle color='white'   size={22}/>
        <h1 className=' text-white'>Add a Business</h1>
      
       </div>
    </DialogTrigger>
  <DialogContent className=' ' >
    <DialogHeader className=' '>
      <DialogTitle className=''>Add the Business here</DialogTitle>
      <DialogDescription className='text-black'>
         carefully input the values
      </DialogDescription>
    </DialogHeader> 
    
    <div className='flex flex-col  items-start gap-3 '>
      <ScrollArea  className='h-[260px]'>
        <div className='flex flex-col gap-3 h-[260px] text-black pt-2 py-2'>
      <div className='flex items-center gap-2 w-full '>
        <h1 className='font-bold text-primary'>Name</h1>
        <Input
          type="text"
          name="name"
          value={newBusiness.name}
          onChange={handleBusinessChange}
          placeholder="Business Name"
          className='w-[80%]'
        />
      </div>
      <div className='flex items-center gap-2 w-full'>
        <h1 className='text-primary font-bold'>Select Category</h1>
      <select
          name="category"
          value={newBusiness.category}
          onChange={handleBusinessChange}
          className='border border-slate-400 p-2 rounded-lg'

        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
       <div className='flex flex-col items-center gap-5'>
        <div className='flex items-center justify-start gap-2'>
       <h1 className='text-primary font-bold'>Upload Image</h1>
          
    <UploadButton
        className='pt-5 flex'
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
           console.log("Files: ", res);
          alert("Upload Completed");
          
          setNewBusiness({
           ...newBusiness,
            bannerImageUrl: res[0]?.url,
            bannerImageKey: res[0]?.key,
          });
            
         
        }}
        onUploadError={(error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      </div>
      {newBusiness.bannerImageUrl&&<Image src={newBusiness.bannerImageUrl} className='p-3' width={120} height={150} alt=""/>}
        </div>
        <div className='flex gap-2 items-center'>
          <h1 className='text-primary font-bold'>Details</h1>
          <Textarea name="details"
        
          value={newBusiness.details}
          onChange={handleBusinessChange}
          placeholder="Enter Details About the Business" className='w-[80%] px-2 border border-2 rounded-lg'></Textarea>
        </div>
        <div className='flex flex-col gap-3'>
        {newBusiness.locations.map((location, index) => (
          <div key={index} className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
            <Input
              type="text"
              name="address"
              value={location.address}
              onChange={(e) => handleLocationChange(index, e)}
              placeholder="Address"
            />
            <Input
              type="text"
              name="contact"
              value={location.contact}
              onChange={(e) => handleLocationChange(index, e)}
              placeholder=" <- Address Contact"
            />
            </div>
            <Button onClick={() => removeLocationField(index)} variant='destructive' className='w-[80%] mx-auto'>Remove Location</Button>
          </div>
        ))}
        <Button onClick={addLocationField} className='bg-green-700 text-white hover:bg-green-800 w-[80%] mx-auto'>Add Location</Button>
        </div>
        </div>
        </ScrollArea>
        <div >
        <Button onClick={addBusiness} className='mx-auto bg-green-700 hover:bg-green-800 text-white'>Add Business</Button>
        </div>
   </div>
  </DialogContent>
  
</Dialog>
  <div className='flex items-center gap-2 border border-primary w-[50%] rounded-lg p-2'>
    <Search className='text-primary font-bold' />
    <input type='text'className='outline-none border-none w-full' placeholder='Search for Added Businesses....' value={searchBusiness} onChange={(e)=>setSearchBusiness(e.target.value)} />
    
  </div>
</div>
   
     <div className='p-3 pt-[100px]  z-0'>
     <table className='border '>
        <thead className=''>
          <tr className='border '>
            <th className='border'>Name</th>
            <th className='border'>Category</th>
            <th className='border'>ImageUrl</th>
            <th className='border'>Edit</th>
            <th className='border'>Delete</th>
          </tr>
        </thead>
        <tbody className='border'>
          {businesses.filter((item)=>{
            return searchBusiness.toLowerCase() ===""?item:item.name.toLowerCase().includes(searchBusiness)
          }).map(business =>(
            <tr key={business._id} className='border'>
              <td className='border px-3 py-2'>{business.name}</td>
              <td className='border px-3 py-2'>{business.category.name}</td>
              <td className='border px-3 py-2'>{business.bannerImageUrl}</td>
              <td className='border px-3 py-2'> 
               
                <Drawer>
  <DrawerTrigger className='bg-green-700 hover:bg-green-800 w-full p-2 rounded-lg text-white'>Edit</DrawerTrigger>
  <DrawerContent className='bg-primary'>
    <DrawerHeader>
      <DrawerTitle className='text-white'>Edit business Details</DrawerTitle>
      <DrawerDescription className='text-white'>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <div className='flex flex-col gap-2 w-[60%] mx-auto'>
    <Button onClick={() => editBusiness(business)} className='mx-auto bg-green-700 hover:bg-green-800 text-white'>Click here first and start editing</Button>
    <div className='flex flex-col  items-start gap-3 bg-cyan-800 rounded-lg '>
      <ScrollArea  className='h-[260px] mx-auto p-2 px-20 bg-white'>
        <div className='flex flex-col gap-3 h-[260px] text-black pt-2 py-2'>
      <div className='flex items-center gap-2 w-full '>
        <h1 className='font-bold text-primary'>Name</h1>
        <Input
          type="text"
          name="name"
          value={newBusiness.name}
          onChange={handleBusinessChange}
          placeholder="Business Name"
          className='w-[80%]'
        />
      </div>
      <div className='flex items-center gap-2 w-full'>
        <h1 className='text-primary font-bold'>Select Category</h1>
      <select
          name="category"
          value={newBusiness.category}
          onChange={handleBusinessChange}
          className='border border-slate-400 p-2 rounded-lg'

        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
       <div className='flex flex-col  gap-5'>
        <div className='flex items-center justify-start gap-2'>
       <h1 className='text-primary font-bold'>Upload Banner Image</h1>
          
    <UploadButton
        className='pt-5 '
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
           console.log("Files: ", res);
          alert("Upload Completed");
          
          setNewBusiness({
           ...newBusiness,
            bannerImageUrl: res[0]?.url,
            bannerImageKey: res[0]?.key,
          });
            
         
        }}
        onUploadError={(error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      </div>
      {newBusiness.bannerImageUrl&&<Image src={newBusiness.bannerImageUrl} className='p-3' width={120} height={150} alt=""/>}
        </div>
        <div className='flex gap-2 items-center'>
          <h1 className='text-primary font-bold'>Details</h1>
          <Textarea name="details"
          
          value={newBusiness.details}
          onChange={handleBusinessChange}
          placeholder="Enter Details About the Business" className='w-[80%] px-2 border border-2 rounded-lg'></Textarea>
        </div>
        <div className='flex flex-col gap-3'>
        {newBusiness.locations.map((location, index) => (
          <div key={index} className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
            <Input
              type="text"
              name="address"
              value={location.address}
              onChange={(e) => handleLocationChange(index, e)}
              placeholder="Address"
            />
            <Input
              type="text"
              name="contact"
              value={location.contact}
              onChange={(e) => handleLocationChange(index, e)}
              placeholder="Contact"
            />
            </div>
            <Button onClick={() => removeLocationField(index)} variant='destructive'>Remove Location</Button>
          </div>
        ))}
        <Button onClick={addLocationField} className='bg-green-700 text-white hover:bg-green-800'>Add Location</Button>
        </div>
        </div>
        </ScrollArea>
        <div >
        </div>
   </div>
      
     </div>
    <DrawerFooter>
    <Button onClick={addBusiness} className='mx-auto bg-green-700 hover:bg-green-800 text-white'>Update Business</Button>
      <DrawerClose>
        <Button variant="destructive">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
                 </td>
              <td className='border px-3 py-2'>
              <Button onClick={() => deleteBusiness(business._id)} className='w-full'>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

             
     </div>
    </div>
  )
}

export default Businesses


