import { IBuyerDocument } from "@harish-x/jobber-helpers";
import { BuyerModel } from "@users/models/buyer.schema";

const getBuyerByEmail = async (enail:string):Promise<IBuyerDocument | null>=>{
    const buyer:IBuyerDocument | null = await BuyerModel.findOne({email:enail}).exec() as IBuyerDocument;
    return buyer;
}

const getBuyerByUsername = async (username:string):Promise<IBuyerDocument | null>=>{
    const buyer:IBuyerDocument | null = await BuyerModel.findOne({username}).exec() as IBuyerDocument;
    return buyer;
}

const getRandomBuyers = async (count:number):Promise<IBuyerDocument[] | null>=>{
    const buyer:IBuyerDocument[] | null = await BuyerModel.aggregate([{$sample:{size:count}}]).exec() as IBuyerDocument[];
    return buyer;
}

const createBuyer = async (buyerdata:IBuyerDocument):Promise<void>=>{
    const checkIfBuyerExists:IBuyerDocument | null = await getBuyerByEmail(buyerdata.email as string);
    if(!checkIfBuyerExists){
        await BuyerModel.create(buyerdata);
    }   
}

const updateBuyerIsSellerProp = async (email:string):Promise<void>=>{
    await BuyerModel.updateOne({email},{$set:{isSeller:true}});
}

const updateBuyerPurchesedGigsProp = async (buyerId:string,purchasedGigId:string,type:string):Promise<void>=>{
    await BuyerModel.updateOne({_id:buyerId},type === 'purchased-gigs' ? {$push:{purchasedGigs:purchasedGigId}} : {$pull:{purchasedGigs:purchasedGigId}});
}

export {getBuyerByEmail,getBuyerByUsername,getRandomBuyers,createBuyer,updateBuyerIsSellerProp,updateBuyerPurchesedGigsProp};