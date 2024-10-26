import {NextAuthOptions} from "next-auth";
import CredentialsProvder from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User"

export const authOptions = NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name: "Credentials",
            credentials:{
                email:{ label:"Email" , type:"text",
                    placeholder:"Enter Your Email"},
                    password:{ label:"Password", type:"password", placeholder:"Enter Your Password"}
                },
                async authorize(credentials:any):Promise<any>{
                    await dbConnect()
                    try{
                        const user = await UserModel.findOne({
                            $or:[
                                {email: credentials.identifier},
                                {username: credentials.identifier}
                            ]
                        })
                        if(!user)
                        {
                            throw new Error("No user found with this email")
                        }
                        if(user.isVerified){
                            throw new Error("Please verify your account before login")

                        }

                        const ispasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                        if(ispasswordCorrect){
                            
                        }
                         

                    }
                    catch(err:any)
                    {
                        throw new Error(err)
                    }


                }

        })
    ]

}