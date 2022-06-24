import Company from "../models/Company";

export class CompanyController {
  static async createCompany(req, res, next) {
    const adminId = req.user._id;
    const teamId = req.team.id;
    const searchPath = req.file.path;
    const filename = req.file.originalname;
    const replacePath = 'src/uploads/' + filename;
    const newPath = searchPath.replace(searchPath, replacePath);
    const fileUrl = 'http://localhost:5000/' + newPath;
    try {
      const company = await Company.findOne({
        adminId: adminId,
        teamId: teamId,
        companyName: req.body.companyName,
      });

      if (company) {
        throw new Error("Company is already available with this name");
      } else {
        const data= {
          adminId: adminId,
          teamId: teamId,
          companyName: req.body.companyName,
          email: req.body.email,
          phoneNo: req.body.phoneNo,
          website: req.body.website,
          ceoName: req.body.ceoName,
          Address: req.body.Address,
          companyRegistration: req.body.companyRegistration,
          BankName: req.body.BankName,
          IBAN: req.body.IBAN,
          BIC: req.body.BIC,
          logo: fileUrl
        }
        console.log(data);
        const doc = await new Company(data).save();
        if (doc) {
          res.status(200).json({
            Status_code: 200,
            message: "Company created",
            data: doc,
          });
        }else{
            res.status(400).json({message: "Company is not created"});
        }
      }
    } catch (e) {
      next(e);
    }
  }

    static async getCompanyById (req, res, next){
        const adminId = req.user._id;
        const teamId = req.team.id;
        const companyId = req.params.CompanyId;
        try{
          const data :any= await Company.findOne({adminId:adminId, teamId:teamId,_id:companyId});
          if(data){
              res.status(200).json({
                  Status_code: 200,
                  message: "Company found",
                  data: data,
                });
          }else{
              res.status(400).json({message: "Company not found"});
          }
        }catch(e){
            next(e);
        }

    }

    static async updateCompanyById (req, res, next) {
      const adminId = req.user._id;
      const teamId = req.team.id;
      const companyId = req.params.companyId;
        try{
          const data = await Company.findOneAndUpdate({adminId: adminId, teamId: teamId,_id:companyId},{
              ...req.body, updatedAt: Date.now()
          },{new:true});
          if(data){
              res.status(200).json({
                  Status_code: 200,
                  message: "Company updated",
                  data: data,
                });
          }else{
              res.status(400).json({message: "Company not found"});
          }
        }catch(e){
            next(e);
        }
    }
}
