import { prisma } from '$lib';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    let tokenid = cookies.get("tokenId") ?? "";

    // get the user that is connected to the token
    let token = await prisma.token.findUnique({where: {id: tokenid}});
    if(!token){
        throw redirect(307, "/login");
    }

    let orders = await prisma.orders.findMany({include: {votes: true}, orderBy: {totalVotes: "desc"}});
    let yep = orders.map((order) => {
        return {
            id: order.id,
            titel: order.titel,
            description: order.description,
            totalVotes: order.votes.length,
            hasVoted: order.votes.some((vote) => vote.id === token.userId)
        }
    });
    return {orders: yep};
}) satisfies PageServerLoad;

export const actions: Actions = {
    createOrderRecomendation: async ({ request }) => {
        let data = await request.formData();
        let titel = data.get("titel")?.toString() || "";
        let description = data.get("desc")?.toString() || "";

        let newOrder = await prisma.orders.create({
            data: {
                titel: titel,
                description: description,
                totalVotes: 0
            }
        })
    },
    voteOrder: async ({ request,cookies }) => {
        let data = await request.formData();
        let id = data.get("id")?.toString() || "";


        let order = await prisma.orders.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                votes: true
            }
        });


        // get the token u set when u login
        let tokenId = cookies.get("tokenId");

        // get the user that is connected to the token
        let token = await prisma.token.findUnique({
            where: {
                id: tokenId
            }
        });

        if(!token || !order){
            throw error(404, "Token not found");
        }

        // check if the user has already voted for the order
        const hasLikedPost = order.votes.some((order) => order.id === token.userId);

        // if the user has already voted for the order, remove the vote
        if (hasLikedPost) {
            await prisma.user.update({
            where: { id: token.userId },
            data: { votes: { disconnect: { id: order.id } } },
            });
        } else {
            await prisma.user.update({
            where: { id: token.userId },
            data: { votes: { connect: { id: order.id } } },
            });
        }
    }
};