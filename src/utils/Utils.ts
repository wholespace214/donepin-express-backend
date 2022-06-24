import * as Bcrypt from 'bcrypt';
import * as Multer from 'multer';
import { customAlphabet } from 'nanoid';


const storageOptions =
    Multer.diskStorage({
        destination: function (req,file,cb) {
            cb(null,'./src/uploads');

        },
        filename: function (req,file,cb) {
            cb(null,file.originalname);

        }
    });

// const fileFilter = (req,file,cb)=>
// {
//     if(file.mimetype === 'jpeg' || file.mimetype === 'png' || file.mimetype === 'mp4')
//     {
//         cb(null,true);
//     }else
//         {
//             cb(null, false);
//             return cb(new Error('Only .png,mp4 and .jpeg format allowed!'));

//         }
// }

export class Utils
{
    public MAX_TOKEN_TIME = 60 * 60 * 1e3;

    public multer : any = Multer({storage: storageOptions});

   public genreateVerificationToken = (size)=> customAlphabet("123456789",size)();

    static encryptPassword(password:string):Promise<any>
    {
        return new Promise((resolve,reject) =>
        {

            Bcrypt.hash(password,10,(err,hash)=>
            {
                if(err)
                {
                    reject(err);

                }else
                {
                    resolve(hash);
                }

            })
        })
    }

    static async comparePassword(password:{plainPassword:string,encryptedPassword:string}):Promise<any>
    {

            return new Promise((resolve,reject)=>
            {
                Bcrypt.compare(password.plainPassword,password.encryptedPassword,((err,isSame)=>
                {
                    if(err)
                    {
                        reject(err);
                    }
                    else if(!isSame)
                    {
                        reject(new Error('USER AND PASSWORD DOES NOT MATCH'));
                    }else
                        {
                            resolve(true);
                        }
                }));

            });

    }


}
