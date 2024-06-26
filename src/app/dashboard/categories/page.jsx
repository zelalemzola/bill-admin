"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react'

const Categories = () => {
  
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

   
  useEffect(() => {
    fetchCategories();
  
  }, []);
  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');
    setCategories(response.data.categories);
  };
  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };
  const addCategory = async () => {
    if (editingCategory) {
      const response = await axios.put(`/api/categories/${editingCategory._id}`, { name: newCategory, id: editingCategory._id });
      setCategories(categories.map(cat => cat._id === editingCategory._id ? response.data.category : cat));
      setEditingCategory(null);
    } else {
      const response = await axios.post('/api/categories', { name: newCategory });
      setCategories([...categories, response.data.category]);
    }
    setNewCategory('');
  };
  const editCategory = (category) => {
    setNewCategory(category.name);
    setEditingCategory(category);
  };
  const deleteCategory = async (id) => {
    await axios.delete(`/api/categories/${id}`);
    setCategories(categories.filter(category => category._id !== id));
  };
  
  return (
    <div className='flex flex-col gap-6'>
      <div className='fixed border-b border-primary p-2 bg-white w-full z-30'>
      <div className=' border border-primary p-2 rounded-lg w-fit'>
      <input
          type="text"
          value={newCategory}
          onChange={handleCategoryChange}
          placeholder="New Category"
          className='outline-none p-2 border-l border-t border-b'
        />
        <Button onClick={addCategory}>{editingCategory ? 'Update Category' : 'Add Category'}</Button>
      </div>
    </div>
    <div className='p-10 z-0 pt-[95px]'>
      <table className='border'>
        <thead >
          <tr className='border'>
            <th className='border'>Name</th>
            <th className='border'>Edit</th>
            <th className='border'>Delete</th>
          </tr>
        </thead>
        <tbody className='border'>
          {categories.map(category => (
            <tr key={category._id} className='border'>
              <td className='border px-3 py-2'>{category.name}</td>
              <td className='border px-3 py-2'>    
                   <Button onClick={() => editCategory(category)} className='bg-green-700 hover:bg-green-800 text-white' >Edit</Button>   
                 
              </td>
              <td className='border px-3 py-2'>    
              
                   <Button onClick={() => deleteCategory(category._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Categories

