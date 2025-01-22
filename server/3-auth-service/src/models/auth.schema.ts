import {sequelize} from '@auth/database'
import bcrypt from "bcrypt";
import { IAuthDocument } from "@harish-x/jobber-helpers";
import { DataTypes, ModelDefined,Optional,Model } from 'sequelize';


type AuthUserCreationAttributes = Optional<IAuthDocument, "id" | 'createdAt' | 'passwordResetExpires'>;
interface AuthModelInstanceMethods extends Model {
    prototype: {
      comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
      hashPassword: (password: string) => Promise<string>;
    }
  }

export const AuthModal:ModelDefined<IAuthDocument, AuthUserCreationAttributes>  & AuthModelInstanceMethods =  sequelize.define('auths', {
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    profilePublicId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    country:{
        type:DataTypes.STRING,
        allowNull:false
    },
    profilePicture:{
        type:DataTypes.STRING,
        allowNull:false
    },
    emailVerificationToken:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    emailVerified:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:0
    },
    createdAt:{
        type:DataTypes.DATE,
        defaultValue:Date.now()
    },
    passwordResetToken:{
        type:DataTypes.STRING,
        allowNull:true
    },
    passwordResetExpires:{
        type:DataTypes.DATE,
        allowNull:true
    }
},{
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            unique: true,
            fields: ['username']
        }
    ]
})  as ModelDefined<IAuthDocument, AuthUserCreationAttributes> & AuthModelInstanceMethods;

AuthModal.addHook('beforeCreate', async (user:Model) => {
    const salt = await bcrypt.genSalt(10);
    user.dataValues.password = await bcrypt.hash(user.dataValues.password, salt);
});

AuthModal.prototype.comparePassword = async function (candidatePassword: string,hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
    return isMatch;
  };
AuthModal.prototype.hashPassword = async  function (password:string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash  
}
AuthModal.sync({force:false})