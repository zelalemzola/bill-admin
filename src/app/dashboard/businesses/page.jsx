"use client"
// pages/dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadDropzone } from '@uploadthing/react';
import { UploadButton } from '../../../utils/uploadthing';
import { Check, ChevronsUpDown, Ellipsis, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/drawer";
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
const Businesses = () => {
  const initcontent =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';
 const [content,setContent] = useState(initcontent);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setNewBusiness({...newBusiness,details:editor.getHTML()});
    },
  });
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [searchBusiness, setSearchBusiness] = useState('');
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    category: '',
    bannerImageUrl: '',
    bannerImageKey: '',
    locations: [{ address: '', contact: '' }],
    details: '',
    socialMedias: [{ name: '', link: '' }],
    likes: 0,
    clicks: 0,
  });
  const [editingBusiness, setEditingBusiness] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchBusinesses();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');
    setCategories(response.data.categories);
  };

  const fetchBusinesses = async () => {
    const response = await axios.get('/api/businesses');
    setBusinesses(response.data.businesses);
  };

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setNewBusiness({ ...newBusiness, [name]: value });
  };

  const handleBusinessCategoryChange = (e) => {
    const categoryId = e.target.value;
    setNewBusiness({ ...newBusiness, category: categoryId });
  };

  const handleLocationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLocations = newBusiness.locations.map((location, i) =>
      i === index ? { ...location, [name]: value } : location
    );
    setNewBusiness({ ...newBusiness, locations: updatedLocations });
  };

  const handleSocialMediaChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSocialMedias = newBusiness.socialMedias.map((socialMedia, i) =>
      i === index ? { ...socialMedia, [name]: value } : socialMedia
    );
    setNewBusiness({ ...newBusiness, socialMedias: updatedSocialMedias });
  };

  const isFormValid = () => {
    const { name, category, details, locations, socialMedias } = newBusiness;
    return (
      name.trim() &&
      category &&
      details.trim() &&
      locations.every(location => location.address.trim() && location.contact.trim()) &&
      socialMedias.every(socialMedia => socialMedia.name.trim() && socialMedia.link.trim())
    );
  };

  const addBusiness = async () => {
    if (!isFormValid()) {
      alert('All fields are required.');
      return;
    }

    try {
      if (editingBusiness) {
        const response = await axios.put(`/api/businesses/${editingBusiness._id}`, { id: editingBusiness._id, ...newBusiness });
        const updatedBusiness = response.data.business;
        setBusinesses(businesses.map(bus => bus._id === editingBusiness._id ? updatedBusiness : bus));
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
        socialMedias: [{ name: '', link: '' }],
        likes: 0,
        clicks: 0,
      });
    } catch (error) {
      console.error("Failed to add or edit business:", error);
    }
  };

  const editBusiness = (business) => {
    setContent(business.details); // Update the content state
    if (editor) {
      editor.commands.setContent(business.details); // Update the editor content
    }
    setNewBusiness({
      name: business.name,
      category: business.category._id,
      bannerImageUrl: business.bannerImageUrl,
      bannerImageKey: business.bannerImageKey,
      locations: business.locations,
      details: business.details,
      socialMedias: business.socialMedias,
      likes: business.likes,
      clicks: business.clicks,
    });
    setEditingBusiness(business);
  };
  
  const deleteBusiness = async (id) => {
    await axios.delete(`/api/businesses/${id}`, { params: { id: id } });
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

  const addSocialMediaField = () => {
    setNewBusiness({
      ...newBusiness,
      socialMedias: [...newBusiness.socialMedias, { name: '', link: '' }],
    });
  };

  const removeSocialMediaField = (index) => {
    setNewBusiness({
      ...newBusiness,
      socialMedias: newBusiness.socialMedias.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className='fixed bg-white border-b border-b-2 p-2 w-full z-30 px-4 flex gap-40'>
      <Drawer>
  <DrawerTrigger>
  <div className='flex items-center justify-between gap-10 rounded-sm p-2 bg-primary'>
              <PlusCircle color='white' size={22} />
              <h1 className=' text-white'>Add a Business</h1>
            </div>
  </DrawerTrigger>
  <DrawerContent className='h-[95%] bg-primary'>
    <DrawerHeader className='bg-primary'>
      <DrawerTitle className='text-white'>Add the new business here</DrawerTitle>
      <DrawerDescription className='text-white'>carefully input all values</DrawerDescription>
    </DrawerHeader>
    <div className='flex flex-col items-start gap-3 '>
              <ScrollArea className='h-full px-2 w-full bg-white'>
                <div className='flex flex-col gap-3 h-[360px] text-black pt-2 py-2 px-2'>
                  <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-2 w-1/2 '>
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
                      onChange={handleBusinessCategoryChange}
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
                  </div>
                  <div className='flex flex-col  gap-5'>
                    <div className='flex items-center justify-start gap-2'>
                      <h1 className='text-primary font-bold'>Upload Image</h1>
                      <UploadButton
                        className='pt-5 flex'
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          console.log("Files: ", res);
                          alert("Upload Completed");
                          setNewBusiness({
                            ...newBusiness,
                            bannerImageUrl: res[0]?.url,
                            bannerImageKey: res[0]?.key,
                          });
                        }}
                        onUploadError={(error) => {
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                    </div>
                    {newBusiness.bannerImageUrl && <Image src={newBusiness.bannerImageUrl} className='p-3' width={120} height={150} alt="" />}
                  </div>
                  
                  <div className='h-screen my-4 px-6 flex flex-col gap-2'>
                    <h1 className='text-primary font-bold'>Enter Details about the business</h1>
                  <RichTextEditor editor={editor} className='w-full'  name="details"
                      value={newBusiness.details}
                      onChange={(value)=>{setNewBusiness({...newBusiness,details:value.getHTML()})}}>
      <RichTextEditor.Toolbar sticky stickyOffset={60} className=''>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content value={newBusiness.details}
                      onChange={handleBusinessChange}/>
    </RichTextEditor>
    </div>
                  <div className='flex flex-col gap-2'> 
                    <h1 className='text-primary font-bold'>Enter addresses of the business with their respective contact</h1>
                  <div className='flex flex-col gap-3 px-[5%]'>
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
                  <div className='flex flex-col gap-2'>
                  <h1 className='text-primary font-bold'>Enter Social addresses of the business</h1>

                  <div className='flex flex-col gap-3'>
                    {newBusiness.socialMedias.map((socialMedia, index) => (
                      <div key={index} className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                          <Input
                            type="text"
                            name="name"
                            value={socialMedia.name}
                            onChange={(e) => handleSocialMediaChange(index, e)}
                            placeholder="Social Media Name"
                          />
                          <Input
                            type="text"
                            name="link"
                            value={socialMedia.link}
                            onChange={(e) => handleSocialMediaChange(index, e)}
                            placeholder="Social Media Link"
                          />
                        </div>
                        <Button onClick={() => removeSocialMediaField(index)} variant='destructive' className='w-[80%] mx-auto'>Remove Social Media</Button>
                      </div>
                    ))}
                    <Button onClick={addSocialMediaField} className='bg-green-700 text-white hover:bg-green-800 w-[80%] mx-auto'>Add Social Media</Button>
                  </div>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    <div className='flex items-center gap-2'>
                      <h1 className='font-bold text-primary'>Likes</h1>
                      <Input
                        type="number"
                        name="likes"
                        value={newBusiness.likes}
                        onChange={handleBusinessChange}
                        placeholder="Likes"
                        className='w-[80%]'
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <h1 className='font-bold text-primary'>Clicks</h1>
                      <Input
                        type="number"
                        name="clicks"
                        value={newBusiness.clicks}
                        onChange={handleBusinessChange}
                        placeholder="Clicks"
                        className='w-[80%]'
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className='bg-primary w-full'>
                <Button onClick={addBusiness} className='mx-auto bg-green-700 hover:bg-green-800 text-white' disabled={!isFormValid()}>Add Business</Button>
              </div>
            </div>
    <DrawerFooter className='bg-primary'>
      <DrawerClose>
        <Button variant="destructive">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
        <div className='flex items-center gap-2 border border-primary w-[30%] rounded-lg p-2 '>
          <Search className='text-primary font-bold' />
          <input type='text' className='outline-none border-none w-full' placeholder='Search for Added Businesses....' value={searchBusiness} onChange={(e) => setSearchBusiness(e.target.value)} />
        </div>

        
      </div>

      <div className='p-3 pt-[100px] z-0'>
        <table className='border '>
          <thead className=''>
            <tr className='border '>
              <th className='border'>Name</th>
              <th className='border'>Category</th>
              <th className='border'>ImageUrl</th>
              <th className='border'>Likes</th>
              <th className='border'>Clicks</th>
              <th className='border'>Edit</th>
              <th className='border'>Delete</th>
            </tr>
          </thead>
          <tbody className='border'>
            {businesses.filter((item) => {
              return searchBusiness.toLowerCase() === "" ? item : item.name.toLowerCase().includes(searchBusiness);
            }).map(business => (
              <tr key={business._id} className='border'>
                <td className='border px-3 py-2'>{business.name}</td>
                <td className='border px-3 py-2'>{business.category.name}</td>
                <td className='border px-3 py-2'>{business.bannerImageUrl}</td>
                <td className='border px-3 py-2'>{business.likes}</td>
                <td className='border px-3 py-2'>{business.clicks}</td>
                <td className='border px-3 py-2'>
                  <Drawer>
                    <DrawerTrigger className='bg-green-700 hover:bg-green-800 w-full p-2 px-3 rounded-lg text-white'>Edit</DrawerTrigger>
                    <DrawerContent className='bg-primary h-[95%]'>
                      <DrawerHeader className=' flex items-center justify-center gap-4'>
                        <DrawerTitle className='text-white'>Edit business Details</DrawerTitle>
                        <DrawerDescription className='text-white'>
                        <Button onClick={() => editBusiness(business)} className=' mx-auto bg-green-700 hover:bg-green-800 text-white'>Click here first and start editing</Button>
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className='flex flex-col gap-2 w-full mx-auto relative '>
                        <div className='flex flex-col  items-start gap-3 bg-cyan-800 rounded-lg '>
                          <ScrollArea className='h-[310px] mx-auto p-2 px-20 bg-white w-full'>
                            <div className='flex flex-col gap-3 h-full text-black pt-2 py-2'>
                              <div className='flex gap-4 flex-wrap'>
                              <div className='flex items-center gap-2 w-1/2 '>
                                <h1 className='font-bold text-primary'>Name</h1>
                                <Input
                                  type="text"
                                  name="name"
                                  value={newBusiness.name}
                                  onChange={handleBusinessChange}
                                  placeholder="Business Name"
                                  className='w-full'
                                />
                              </div>
                              <div className='flex items-center gap-2'>
                                <h1 className='text-primary font-bold'>Select Category</h1>
                                <select
                                  name="category"
                                  value={newBusiness.category}
                                  onChange={handleBusinessCategoryChange}
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
                              </div>
                              <div className='flex flex-col  gap-5'>
                                <div className='flex items-center justify-start gap-2'>
                                  <h1 className='text-primary font-bold'>Upload Banner Image</h1>
                                  <UploadButton
                                    className='pt-5 '
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                      console.log("Files: ", res);
                                      alert("Upload Completed");
                                      setNewBusiness({
                                        ...newBusiness,
                                        bannerImageUrl: res[0]?.url,
                                        bannerImageKey: res[0]?.key,
                                      });
                                    }}
                                    onUploadError={(error) => {
                                      alert(`ERROR! ${error.message}`);
                                    }}
                                  />
                                </div>
                                {newBusiness.bannerImageUrl && <Image src={newBusiness.bannerImageUrl} className='p-3' width={120} height={150} alt="" />}
                              </div>
                              <div className='flex gap-2 items-center'>
                                <h1 className='text-primary font-bold'>Details</h1>
                                <RichTextEditor editor={editor} className='w-full'  name="details"
                      value={newBusiness.details}
                      onChange={(value)=>{setNewBusiness({...newBusiness,details:value.getHTML()})}}>
      <RichTextEditor.Toolbar sticky stickyOffset={60} className=''>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content value={newBusiness.details}
                      onChange={handleBusinessChange}/>
    </RichTextEditor>
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
                              <div className='flex flex-col gap-3'>
                                {newBusiness.socialMedias.map((socialMedia, index) => (
                                  <div key={index} className='flex flex-col gap-2'>
                                    <div className='flex items-center gap-2'>
                                      <Input
                                        type="text"
                                        name="name"
                                        value={socialMedia.name}
                                        onChange={(e) => handleSocialMediaChange(index, e)}
                                        placeholder="Social Media Name"
                                      />
                                      <Input
                                        type="text"
                                        name="link"
                                        value={socialMedia.link}
                                        onChange={(e) => handleSocialMediaChange(index, e)}
                                        placeholder="Social Media Link"
                                      />
                                    </div>
                                    <Button onClick={() => removeSocialMediaField(index)} variant='destructive'>Remove Social Media</Button>
                                  </div>
                                ))}
                                <Button onClick={addSocialMediaField} className='bg-green-700 text-white hover:bg-green-800'>Add Social Media</Button>
                              </div>
                              <div className='flex flex-col gap-2'>
                                <div className='flex items-center gap-2'>
                                  <h1 className='font-bold text-primary'>Likes</h1>
                                  <Input
                                    type="number"
                                    name="likes"
                                    value={newBusiness.likes}
                                    onChange={handleBusinessChange}
                                    placeholder="Likes"
                                    className='w-[80%]'
                                  />
                                </div>
                                <div className='flex items-center gap-2'>
                                  <h1 className='font-bold text-primary'>Clicks</h1>
                                  <Input
                                    type="number"
                                    name="clicks"
                                    value={newBusiness.clicks}
                                    onChange={handleBusinessChange}
                                    placeholder="Clicks"
                                    className='w-[80%]'
                                  />
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                          <div>
                          </div>
                        </div>
                      </div>
                      <DrawerFooter>
                        <Button onClick={addBusiness} className='mx-auto bg-green-700 hover:bg-green-800 text-white' disabled={!isFormValid()}>Update Business</Button>
                        <DrawerClose>
                          <h1 className='text-white'>If you are done updating click here to close the modal</h1>
                          <Button variant="destructive">Close</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </td>
                <td className='border px-3 py-2'>
                  <Button onClick={() => deleteBusiness(business._id)} className='w-full' variant='destructive'>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Businesses;
