import { signupSchema } from "@auth/schemas/signup";
import { createAuthUser, getUserByUsernameOrEmail, signToken } from "@auth/services/auth.service";
import { BadRequestError, firstLetterUppercase, IAuthDocument, IEmailMessageDetails, lowerCase, uploads } from "@harish-x/jobber-helpers";
import { UploadApiResponse } from "cloudinary";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import crypto from "crypto";
import { config } from "@auth/config";
import { publichDirectMessage } from "@auth/queues/auth.producer";
import { authChannel } from "@auth/server";
import { StatusCodes } from "http-status-codes";

export async function create(req:Request,res:Response) {
    const {error} = await Promise.resolve(signupSchema.validate(req.body));
    if (error?.details) {
        throw new BadRequestError(error.details[0].message,'signup create method error');
    }

    const {username, email, password, country, profilePicture} = req.body;

    const checkUserExist = await getUserByUsernameOrEmail(email,username);

    if (checkUserExist) {
        throw new BadRequestError('email already exist','signup create method error');
    }

    const profilePublicId = uuid();
    const uploadResults: UploadApiResponse = await uploads(profilePicture, profilePublicId, true, true) as UploadApiResponse;
    if(!uploadResults.public_id) {
        throw new BadRequestError('profile picture upload failed','signup create method error');
    }
    const randomBytes:Buffer = await Promise.resolve(crypto.randomBytes(20)) as Buffer;
    const randomCharacters:string = randomBytes.toString('hex');
    const authData: IAuthDocument = {
        username: firstLetterUppercase(username),
        email: lowerCase(email),
        profilePublicId: profilePublicId,
        password: password,
        country,
        profilePicture: uploadResults.secure_url,
        emailVerificationToken: randomCharacters,

    } as IAuthDocument;

    const result: IAuthDocument = await createAuthUser(authData);
    const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;
    const messageDetails:IEmailMessageDetails={
        receiverEmail:result.email,
        verifyLink:verificationLink,
        template:'verifyEmail',
    }
    await publichDirectMessage(
          authChannel,
         'jobber-email-notification',
         'auth-email',
         JSON.stringify(messageDetails),
         `verify email message sent to notification service`
    );
    const userJWT:string = signToken(result.id!, result.email!, result.username!);
    res.status(StatusCodes.CREATED).json({message:'User created successfully',user:result,token:userJWT,});
}