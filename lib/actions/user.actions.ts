'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
    const {databases} = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('email',[email])],
    );
    return result.total > 0 ? result.documents[0] : null;
}

const handleError = (error:unknown, message: string) => {
    console.error(message, error);
    throw error;
}

const sendEmailOTP = async ({email} : {email: string}) => {
    const {account} = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;

    } catch (error) {
        handleError(error, 'Failed to send email OTP');
    }
}

export const createAccount = async ({
    fullName,email}:{
        fullName:string;
        email:string;
    }) => {
        const existingUser = await getUserByEmail(email);

        const accountId = await sendEmailOTP({email});
        if (!accountId) throw new Error('Failed to send an OTP');

        if(!existingUser){
            const {databases} = await createAdminClient();

            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                ID.unique(),
                {
                    fullName,
                    email,
                    avatar:'https://www.google.com/imgres?q=avatar%20icon&imgurl=https%3A%2F%2Fcdn.icon-icons.com%2Ficons2%2F2630%2FPNG%2F512%2Favatar_people_woman_girl_asian_icon_159134.png&imgrefurl=https%3A%2F%2Ficon-icons.com%2Ficon%2Favatar-people-woman-girl-asian%2F159134&docid=xbBlqkCjAiLjmM&tbnid=6HruKkAXgaXG4M&vet=12ahUKEwiTz9bD5dKJAxVuxDgGHZKOCrcQM3oECFAQAA..i&w=512&h=512&hcb=2&ved=2ahUKEwiTz9bD5dKJAxVuxDgGHZKOCrcQM3oECFAQAA',
                    accountId,
                },
            );
        }
        return parseStringify({accountId});
    }