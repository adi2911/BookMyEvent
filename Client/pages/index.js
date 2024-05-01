import buildClient from "../api/build-client";
const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
   
    return <h1>{ currentUser ? "You are signed in" : "You are not signed in" }</h1>;
};
/*server rendering of getInitialProps gives error if we directly hit /api/users/currentuser due to k8s container
 we need to request to the url through ingnress-nginx, keeping the cookie information.
*/
LandingPage.getInitialProps = async(context)=>{
    const client = buildClient(context);
   const {data} = await client.get('/api/users/currentuser')
   return data
}

export default LandingPage