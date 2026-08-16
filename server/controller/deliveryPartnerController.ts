
import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import jwt from 'jsonwebtoken';
import { stat } from 'node:fs';
import { timeStamp } from 'node:console';

const generateToken = (id: string) => {
  return jwt.sign({id, role: "delivery"}, process.env.JWT_SECRET as string, {expiresIn: "30d"})
}

//LOGIN entregador parceiro
export const loginPartner = async (req: Request, res: Response) => {
  const {email, password} = req.body;

  if(!email || !password) {
   return res.status(404).json({ message: "Please provide emial and password"})
  }

  const partner = await prisma.deliveryPartner.findUnique(
   {
    where: {
     email: email.toLowerCase()
    }
   }
  )

  if(!partner) {
   return res.status(401).json({ message: "Invalid email or password"})
  }

  if(!partner.isActive) {
    return res.status(403).json({ message: "Your account has been deactivated"})
  }

  const isMatch = await bcrypt.compare(password, partner.password)

  if(!isMatch) {
   return res.status(401).json({ message: "Invalid email or password"})
  }

  const token = generateToken(partner.id);
  const {password: _, ...partnerData} = partner;

  res.json({partner: partnerData, token})
}

//GET atribui entrega
//GET api/delivery/my-deliveries

export const getMyDeliveries = async (req: Request, res: Response) => {
  const { status } = req.query;

  const where: any = {deliveryPartnerId: req.partner!.id};

  if(status === "active"){
    where.status = { in: ["Assigned", "Packed", "Out for Delivery"]}
  }else if(status === "completed") {
    where.status = { in: ["Delivered", "Cancelled",]}
  }

  const orders = await prisma.order.findMany(
   {
    where,
    include: {
     user: {
      select: {
       name: true,
       email: true,
       phone: true
      }
     }
    },
    orderBy: {
     createdAt: "desc"
    }
   }
  )
  res.json({orders})
}

//GET detalhe de entrega unica
//GET api/delivery/my-delivery/:id
export const getDeliveryDetail = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst(
   {
    where: {
     id: req.params.id as string,
     deliveryPartnerId: req.partner!.id
    },
    include: {
     user: {
      select: {
       name: true,
       email: true,
       phone: true
      }
     } 
    }
   }
  )
  if(!order){
   return res.status(404).json({ message: "Delivery not found"})
  }
  res.json({order})
}

//Concluir entrega com otp
//PUT api/delivery/my-deliveries/:id

export const completeDelivery = async(req: Request, res: Response) => {
  const {otp} = req.body;

  const order = await prisma.order.findFirst(
   {
    where: {
     id: req.params.id as string,
     deliveryPartnerId: req.partner!.id
    }
   })
   if(!order || order.status === "Cancelled" || order.status === "Delivered") {
    return res.status(400).json({ message: "Invalid Request"})
   }

   if(order.deliveryOtp !== otp) {
    return res.status(500).json({ message: "Invalid OTP"})
   }

   const history = order.statusHistory as any[];

   history.push(
    {
     status: "Delivered",
     note: "Delivered by partner",
     timeStamp: new Date()
    })

    const updateOrder = await prisma.order.update(
     {
      where: {
       id: order.id
      },
      data: {
       status: "Delivered",
       statusHistory: history, deliveryOtp: ""
      }
     })
     res.json({ order: updateOrder, message: "Delivery completed successfully"})
}

//Cancel delivery
//PUT api/delivery/my-deliveries/:id
export const cancelDelivery = async(req: Request, res: Response) => {
  const {reason} = req.body;

  const order = await prisma.order.findFirst(
   {
    where: {
     id: req.params.id as string,
     deliveryPartnerId: req.partner!.id
    }
   })
   if(order!.status === "Delivered") {
    return res.status(400).json({ message: "Cannot cancel a delivered order"})
   }

   const history = order!.statusHistory as any[];

   history.push(
    {
     status: "Delivered", 
     note: reason || "",
     timeStamp: new Date()
    })

    const updateOrder = await prisma.order.update(
     {
      where: {
       id: order!.id
      },
      data: {
       status: "Cancelled",
       statusHistory: history
      }
     }
    )

    res.json({ order: updateOrder, message: "Delivery cancelled"})
}

//PUT order status
//PUT api/delivery/my-deliveries/:id
export const updateDeliveryStatus = async(req: Request, res: Response) => {
 const { status } = req.body;

 const allowedStatus = ["Packed", "Out for Delivery"]

 if(!allowedStatus.includes(status)){
  return res.status(400).json({ message: "Invalid status update"})
 }

 const order = await prisma.order.findFirst(
  {
   where: {
    id: req.params.id as string,
    deliveryPartnerId: req.partner!.id
   }
  })
  const history = order!.statusHistory as any[];

   history.push(
    {
     status, 
     note: `Status update to ${status}`,
     timeStamp: new Date()
    })

   const updateOrder = await prisma.order.update(
    {
     where: {
      id: order!.id
     },
     data: {
      status,
      statusHistory: history
     }
    })
    res.json({ order: updateOrder})
}

//PUT live location
//PUT api/delivery/my-deliveries/:id
export const updateLocation = async(req: Request, res: Response) => {
  const { lat, lng} = req.body;
  const order = await prisma.order.findFirst(
   {
    where: {
     id: req.params.id as string,
     deliveryPartnerId: req.partner!.id,
     status: {
      in: ["Assigned", "Packed", "Out for delivery"]
     }
    }
   })
   await prisma.order.update(
    {
     where: {
      id: order!.id
     },
     data: {
      liveLocation: {
       lat, lng,
       updateAt: new Date()
      }
     }
    })
    res.json({success: true})
}
