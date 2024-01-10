import { NextResponse } from "next/server";
import { getProductById } from "@/data/products";

export async function POST(req: Request) {
    const body = await req.json();
    const { id } = body;
    
    // let data = JSON.stringify({
    //     query: getProductDataQuery(id),
    //     variables: {}
    // });
      
    // let config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: process.env.IAI_URL || "",
    //     headers: { 
    //         'Content-Type': 'application/json'
    //     },
    //     data : data
    // };
    
    // const response = await axios.request(config)
    const product = await getProductById(id)
    return NextResponse.json({ returnData: product }, { status: 200 })
}