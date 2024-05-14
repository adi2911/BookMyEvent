import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Headers from "../components/headers";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Headers currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

/*
getInitialProps doesn't work directly at more than two places. To make it work in multiple place we have manually call it in th first call.
*/

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx); //appContext is different from index context
  const { data } = await client.get("/api/users/currentuser");
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }
  return { pageProps, ...data };
};

export default AppComponent;
