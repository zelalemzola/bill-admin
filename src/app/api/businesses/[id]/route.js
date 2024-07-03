// app/api/businesses/[id]/route.js
import { connectdb } from "../../../../lib/config/db";
import Business from '../../../../lib/models/Business';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function PUT(request) {
  const { id, name, category, bannerImageUrl, bannerImageKey, locations, details, socialMedias, likes, clicks } = await request.json();
  const business = await Business.findByIdAndUpdate(
    id, 
    { name, category, bannerImageUrl, bannerImageKey, locations, details, socialMedias, likes, clicks },
    { new: true, runValidators: true }
  );
  return NextResponse.json({ business });
}

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get('id');
  await Business.findByIdAndDelete(id);
  return NextResponse.json({ msg: 'Business Deleted' });
}
