import {Enviornment} from "./env";

export const DevEnviornment : Enviornment =
    {
        db_url:process.env.MONGODB_URL,
        jwt_secret_key:process.env.SECRET_KEY
    }
