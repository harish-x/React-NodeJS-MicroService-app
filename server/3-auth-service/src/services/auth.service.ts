import { AuthModal } from "@auth/models/auth.schema";
import { publichDirectMessage } from "@auth/queues/auth.producer";
import { authChannel } from "@auth/server";
import { firstLetterUppercase, IAuthBuyerMessageDetails, IAuthDocument, lowerCase, winstonLogger } from "@harish-x/jobber-helpers";
import { Model, Op } from "sequelize";
import { omit } from "lodash";
import { config } from "@auth/config";
import {sign} from 'jsonwebtoken'
import { Logger } from "winston";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authService', 'debug');
export async function createAuthUser(data:IAuthDocument): Promise<IAuthDocument> {
    const result:Model = await AuthModal.create(data);
    const messageDetails: IAuthBuyerMessageDetails = {
        username: result.dataValues.username,
        email: result.dataValues.email,
        profilePicture: result.dataValues.profilePicture,
        country: result.dataValues.country,
        createdAt: result.dataValues.createdAt,
        type: 'auth'
    };
    await publichDirectMessage(authChannel, 'jobber-buyer-update','user-buyer',JSON.stringify(messageDetails),`buyer details sent to buyer service`);

    const userData:IAuthDocument = omit(result.dataValues, ['password']) as IAuthDocument;
    return userData
}


export async function getAuthUserById(authId: string): Promise<Model<IAuthDocument>> {
    const user:Model = await AuthModal.findOne({where:{id:authId},attributes:{exclude:['password']}}) as Model
    return user?.dataValues
}

export async function getUserByUsernameOrEmail(email: string,username:string): Promise<Model<IAuthDocument>> {
    const user:Model = await AuthModal.findOne({where:{[Op.or]:[{email:lowerCase(email)},{username:firstLetterUppercase(username)}]},attributes:{exclude:['password']}}) as Model
    return user?.dataValues
}

export const  getUserByUsername = async (username:string): Promise<IAuthDocument> => {
    const user:Model = await AuthModal.findOne({where:{username:firstLetterUppercase(username)},attributes:{exclude:['password']}}) as Model
    return user?.dataValues
}

export async function getUserByEmail (email: string): Promise<Model<IAuthDocument>> {
    const user:Model = await AuthModal.findOne({where:{email:lowerCase(email)},attributes:{exclude:['password']}}) as Model
    return user?.dataValues
}

export async function getAuthUserByVerificationToken(token: string): Promise<IAuthDocument | undefined> {
    try {
      const user: Model = await AuthModal.findOne({
        where: { emailVerificationToken: token },
        attributes: {
          exclude: ['password']
        }
      }) as Model;
      return user?.dataValues;
    } catch (error) {
      log.error(error);
    }
  }
  
  export async function getAuthUserByPasswordToken(token: string): Promise<IAuthDocument | undefined> {
    try {
      const user: Model = await AuthModal.findOne({
        where: {
          [Op.and]: [{ passwordResetToken: token}, { passwordResetExpires: { [Op.gt]: new Date() }}]
        },
      }) as Model;
      return user?.dataValues;
    } catch (error) {
      log.error(error);
    }
  }
  
  export async function getAuthUserByOTP(otp: string): Promise<IAuthDocument | undefined> {
    try {
      const user: Model = await AuthModal.findOne({
        where: {
          [Op.and]: [{ otp }, { otpExpiration: { [Op.gt]: new Date() }}]
        },
      }) as Model;
      return user?.dataValues;
    } catch (error) {
      log.error(error);
    }
  }
  
  export async function updateVerifyEmailField(authId: number, emailVerified: number, emailVerificationToken?: string): Promise<void> {
    try {
      await AuthModal.update(
      !emailVerificationToken ?  {
          emailVerified
        } : {
          emailVerified,
          emailVerificationToken
        },
        { where: { id: authId }},
      );
    } catch (error) {
      log.error(error);
    }
  }
  
  export async function updatePasswordToken(authId: number, token: string, tokenExpiration: Date): Promise<void> {
    try {
      await AuthModal.update(
        {
          passwordResetToken: token,
          passwordResetExpires: tokenExpiration
        },
        { where: { id: authId }},
      );
    } catch (error) {
      log.error(error);
    }
  }
  
  export async function updatePassword(authId: number, password: string): Promise<void> {
    try {
      await AuthModal.update(
        {
          password,
          passwordResetToken: '',
          passwordResetExpires: new Date()
        },
        { where: { id: authId }},
      );
    } catch (error) {
      log.error(error);
    }
  }
  
  export async function updateUserOTP(authId: number, otp: string, otpExpiration: Date, browserName: string, deviceType: string): Promise<void> {
    try {
      await AuthModal.update(
        {
          otp,
          otpExpiration,
          ...(browserName.length > 0 && { browserName }),
          ...(deviceType.length > 0 && { deviceType })
        },
        { where: { id: authId }}
      );
    } catch (error) {
      log.error(error);
    }
  }
  
  export function signToken(id: number, email: string, username: string): string {
    return sign(
      {
        id,
        email,
        username
      },
      config.JWT_TOKEN!
    );
  }