import {connectdb} from "../../../../lib/config/db"
import Business from '../../../../lib/models/Business';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function PUT(request) {
  const { id } = request.nextUrl.searchParams;
  const { name, category, bannerImageUrl,bannerImageKey, locations, details } = await request.json();
  const business = await Business.findByIdAndUpdate(id, { name, category, bannerImageUrl,bannerImageKey, locations, details }, { new: true, runValidators: true });
  return NextResponse.json({ business });
}

export async function DELETE(request) {
  const { id } = request.nextUrl.searchParams;
  await Business.findByIdAndDelete(id);
  return NextResponse.json({ msg: 'Business Deleted' });
}
