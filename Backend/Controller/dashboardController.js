import Tutor from "../Model/Tutor"

export const totalTutor = async(req, res) => {
    try{
        const count = Tutor.countDocuments()
        res.status(200).json({"totalTutor" : count})
    }catch(err){
        res.status(500).json(err.message);
    }
}