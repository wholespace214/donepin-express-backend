import * as nodeMailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport';

export class NodeMailer
{
   private static initializeTransport()
   {
       return nodeMailer.createTransport(SendGrid({
           service: 'SendGrid',
           auth:{

               api_key: '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'
           }
           }

       ));
   }

   static sendEmail(data:{to:[string],subject:string,html:string}):Promise<any>
   {
       return NodeMailer.initializeTransport().sendMail({
           from:'support@donepin.com',
           to:data.to,
           subject:data.subject,
           html:data.html
       })
   }
}
