
import {connectdb} from "../../../../lib/config/db"
import Category from '../../../../lib/models/Category';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function PUT(request) {
//   const { id } = request.nextUrl.searchParams;
  const { id,name } = await request.json();
  const category = await Category.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
  return NextResponse.json({ category });
}

export async function DELETE(request) {

  const id = await request.nextUrl.searchParams.get('id');
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ msg: 'Category Deleted' });
}
