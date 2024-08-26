import connectMongo from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/models/user";

export async function POST(request){
    await connectMongo();
    const payload = await request.json()
        const existedUser = await User.findOne({email: payload.email});
        if(existedUser){
            return NextResponse.json({message: 'User already exist.'})
        } 
        try{
            const hashedPassword = await bcrypt.hash(payload.password, 10);
            const user = {
                name: payload.name,
                email: payload.email,
                password: hashedPassword,
            };
            const newUser = new User(user);
            await newUser.save();
            return NextResponse.json({ok:true});
        }catch (e) {
            return NextResponse.json("something went wrong! Check your input again",e);
        }
    
    }