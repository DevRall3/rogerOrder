import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load = (async ({ cookies }) => {
    let tokenid = cookies.get("tokenId") ?? "";
    let token = await prisma.token.findUnique({ where: { id: tokenid } });
    if (!token) {
        throw error(401, "You are not logged in");
    }
    let user = await prisma.user.findUnique({ where: { id: token.userId } });
    if (user?.isAdmin == false) {
        throw error(403, "You are not an admin");
    }

    let unApprovedOrders = await prisma.orders.findMany({ where: {isApproved: false}, include: { votes: true } });
    let approvedOrders = await prisma.orders.findMany({ where: { isApproved: true }, include: { votes: true } });

    let approvedOrdersList = approvedOrders.map(order => {
        return {
            id: order.id,
            title: order.titel,
            description: order.description,
            totalVotes: order.votes.length + order.adminVotes,
            adminVotes: order.adminVotes
        }
    })

    let unApprovedOrderList = unApprovedOrders.map(order => {
        return {
            id: order.id,
            title: order.titel,
            description: order.description,
            totalVotes: order.votes.length + order.adminVotes,
            adminVotes: order.adminVotes
        }
    })

    return { unApprovedOrders: unApprovedOrderList, approvedOrders: approvedOrdersList };
}) satisfies PageServerLoad;

export const actions: Actions = {
    adminVotes: async ({ request }) => {
        let data = await request.formData();
        let adminVotes = data.get("adminVotes")?.toString();
        let orderId = data.get("orderId")?.toString();

        if (!adminVotes || !orderId) {
            throw error(400, "Missing parameters");
        }

        let order = await prisma.orders.findUnique({ where: { id: parseInt(orderId) } });
        if (!order) {
            throw error(404, "Order not found");
        }
        // Update the order with adminVotes
        await prisma.orders.update({where: {id: parseInt(orderId)}, data: {adminVotes: parseInt(adminVotes)}});
    },

    approveTask: async ({ request }) => {
        let data = await request.formData();
        let orderId = data.get("orderId")?.toString();

        if (!orderId) {
            throw error(400, "Missing parameters");
        }

        let order = await prisma.orders.findUnique({ where: { id: parseInt(orderId) } });
        if (!order) {
            throw error(404, "Order not found");
        }
        // Update the order with isApproved
        await prisma.orders.update({where: {id: parseInt(orderId)}, data: {isApproved: true}});
    },

    resetAdminVotes: async ({ request }) => {
        let data = await request.formData();
        let orderId = data.get("orderId")?.toString();

        if (!orderId) {
            throw error(400, "Missing parameters");
        }

        let order = await prisma.orders.findUnique({ where: { id: parseInt(orderId) } });
        if (!order) {
            throw error(404, "Order not found");
        }
        // Update the order with adminVotes
        await prisma.orders.update({where: {id: parseInt(orderId)}, data: {adminVotes: 0}});
    }

};