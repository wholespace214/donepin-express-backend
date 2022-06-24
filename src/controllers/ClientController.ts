import Client from "../models/Client";

export class ClientController {
  static async createClient(req, res, next) {
    const adminId = req.user._id;
    const teamId = req.team.id;
    try {
      const client = await Client.findOne({
        adminId: adminId,
        teamId: teamId,
        name: req.body.name,
        email: req.body.email,
      });
     if(client){
        res.status(400).json({message: 'Client already exists'});
     }else{
        const data = await new Client(req.body).save();
     }
    } catch (e) {
      next(e);
    }
  }

  static async getClient (req, res, next){
      const adminId = req.user._id;
      const teamId = req.team.id;
      try{
        const data :any= await Client.find({adminId:adminId, teamId:teamId});
        if(data){
            res.status(200).json({
                Status_code: 200,
                message: "client found",
                data: data,
              });
        }else{
            res.status(400).json({message: "client not found"});
        }
      }catch(e){
          next(e);
      }

  }
  static async getClientDetail (req, res, next){
    const adminId = req.user._id;
    const teamId = req.team.id;
    const clientId = req.params.clientId;
    try{
      const data :any= await Client.find({adminId:adminId, teamId:teamId,_id:clientId});
      if(data){
          res.status(200).json({
              Status_code: 200,
              message: "client found",
              data: data,
            });
      }else{
          res.status(400).json({message: "client not found"});
      }
    }catch(e){
        next(e);
    }

}

  static async updateClientById (req, res, next) {
    const adminId = req.user._id;
    const teamId = req.team.id;
    const clientId = req.params.clientId;
      try{
        const data = await Client.findOneAndUpdate({adminId: adminId, teamId: teamId,_id:clientId},{
            ...req.body, updatedAt: Date.now()
        },{new:true});
        if(data){
            res.status(200).json({
                Status_code: 200,
                message: "client updated",
                data: data,
              });
        }else{
            res.status(400).json({message: "client not found"});
        }
      }catch(e){
          next(e);
      }
  }
}
