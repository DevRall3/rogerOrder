import * as crypto from "crypto";
import {PrismaClient} from "@prisma/client"
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from "@sveltejs/kit";

const prisma = new PrismaClient();

export const load = (async ({ cookies }) => {
    let user = cookies.get("username");
    if(user){
        throw redirect(307, "/");
    }
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    register: async ({request, cookies}) => {
        let data = await request.formData();
        let email = data.get("email")?.toString();
        let password = data.get("password")?.toString();
        let rePass = data.get("password-repeat")?.toString();
        let name = data.get("fullName")?.toString();
        let gender = data.get("gender")?.toString();
        let age = data.get("age")?.toString();

        if(!email || !name || !password || !rePass || !gender || !age){
            return fail(400, {msg: "Please provide all the necessary information"});
        }
        const possibleUser = await prisma.user.findUnique({where: {email: email}});
        if(possibleUser){
            return fail(400, {msg:"This e-mail is already in use."});
        }
        if(password != rePass){
            return fail(400, {msg: "The passwords are not matching."});
        }

        const pass = hashPassword(password);
        const pUser = await prisma.user.create({
            data: {email: email,age: age, gender: gender, password: pass.hash, salt: pass.salt, name: name}
        });
        const token = await prisma.token.create({
            data: { userId: pUser.id },
        });
        cookies.set("tokenId", token.id, {
            secure: false,
            path: "/"
        });

        cookies.set("username", pUser.name, { secure: false, path: "/"})
        
        throw redirect(307, "/");
    }
};

function hashPassword(password : crypto.BinaryLike){
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}