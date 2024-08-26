import axios from '../axios/axios'

export const updateSpotRate = async(userData)=>{
    console.log(userData)
    try {
        
        return await axios.post('/update-spotRate',userData)
    } catch (error) {
        return error.response
    }
}
