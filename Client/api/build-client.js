import axios from 'axios'

export default ({req}) =>{
    if(typeof window === 'undefined')
    {
        //we are on server, request to ingress
        const ingressURL= "ingress-nginx-controller.ingress-nginx.svc.cluster.local"
        return axios.create({
            baseURL:`http://${ingressURL}`,
            headers:req.headers
        })
    }else{
        //we are on browser, direct request
        return axios.create({
            baseURL:'/',
        })
    }
}