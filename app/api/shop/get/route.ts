import { NextResponse } from "next/server";
import axios from "axios";
import { getProducts4lopQuery } from "@/constants";

export async function POST(req: Request) {
    const body = await req.json();
    
    let data = JSON.stringify({
        query: getProducts4lopQuery({ page: body.page, limit: body.limit, orderBy: body.orderBy, text: body.text, maxPrice: body.maxPrice }),
        variables: {}
    });
      
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.IAI_URL || "",
        headers: { 
            'Content-Type': 'application/json', 
            // 'Cookie': 'client=89f1b5115a991b10ab8ff83aab8326dc'
        },
        data : data
    };
    
    const response = await axios.request(config)
    return NextResponse.json({ returnData: response.data.data.products }, { status: 200 })
}