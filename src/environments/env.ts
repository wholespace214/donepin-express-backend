import {ProdEnviornment} from "./prod.env";
import {DevEnviornment} from "./dev.env";

export interface Enviornment
{
    db_url:string;
    jwt_secret_key: string;
}
export function getEnvironment()
{
    if(process.env.NODE_ENV === 'production') {
        return ProdEnviornment;
    }
    else
        {
            return DevEnviornment;
        }

}