import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";
//POST /api/orders
export const createOrder = async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No order items" });
    }
    const productsId = items.map((item) => item.product);
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productsId
            }
        }
    });
    const productMap = {};
    products.forEach((product) => (productMap[product.id] = product));
    //check se a produto no stock
    for (const item of items) {
        const product = productMap[item.product];
        if (!product || (product.stock ?? 0) < item.quantity) {
            return res.status(404).json({ message: "Product out of stock" });
        }
    }
    const orderItems = items.map((item) => {
        const dbProduct = productMap[item.Product];
        if (!dbProduct)
            throw new Error(`Product ${item.product} not found`);
        return {
            product: dbProduct.id,
            name: dbProduct.name,
            Image: dbProduct.image,
            price: dbProduct.price,
            quantity: item.quantity,
            unit: dbProduct.unit
        };
    });
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 20 ? 0 : 1.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
    const order = await prisma.order.create({
        data: {
            userId: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            deliveryFee,
            tax,
            total,
            statusHistory: [{ status: "Placed", note: "Order placed successfully", timestamp: new Date() }]
        }
    });
    for (const item of orderItems) {
        await prisma.product.update({
            where: { id: item.product },
            data: { stock: { decrement: item.quantity } }
        });
    }
    //Envie atualizaçoes do estoque para cada produto do pedido
    for (const item of orderItems) {
        await inngest.send({
            name: "Inventory/stock.update",
            data: {
                productId: item.product
            }
        });
    }
    await inngest.send({
        name: "order/placed",
        data: {
            orderId: order.id
        }
    });
};
//GET api/orders
export const getUserOrders = async (req, res) => {
    const { status } = req.query;
    const where = {
        userId: req.user?.id,
        NOT: [{ paymentMethod: "Card", isPaid: false }]
    };
    if (status && status !== "all") {
        where.status = status;
    }
    const orders = await prisma.order.findMany({
        where,
        include: {
            deliveryPartner: {
                select: {
                    name: true,
                    phone: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    res.json({ orders });
};
//GET pedido unico
//GET /api/orders/:id
export const getOrder = async (req, res) => {
    const order = await prisma.order.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id
        },
        include: {
            deliveryPartner: {
                select: {
                    name: true,
                    phone: true,
                    avatar: true,
                    vehicleType: true
                }
            }
        }
    });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order });
};
//UPDATE status do pedido(admin)
//PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    const { status, note } = req.body;
    const order = await prisma.order.findUnique({
        where: {
            id: req.params.id
        }
    });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []);
    history.push({ status, note: note || `Order ${status.toLowerCase()}`, timestamp: new Date() });
    const updateOrder = await prisma.order.update({
        where: {
            id: req.params.id
        },
        data: {
            status, statusHistory: history
        }
    });
    res.json({ order: updateOrder });
};
//GET todos pedidos(admin)
//GET /api/orders/all
export const getAllOrders = async (req, res) => {
    const orders = await prisma.order.findMany({
        where: {
            NOT: [{
                    paymentMethod: "card", isPaid: false
                }]
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true
                }
            },
            deliveryPartner: {
                select: {
                    name: true,
                    phone: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    res.json({ orders });
};
//GET localização do pedido
//GET /api/orders/:id/location
export const getOrderLocation = async (req, res) => {
    const order = await prisma.order.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id
        },
        select: {
            liveLocation: true,
            status: true
        }
    });
    if (!order)
        return res.status(404).json({ message: "Order not found" });
    res.json({ liveLocation: order.liveLocation, status: order.status });
};
