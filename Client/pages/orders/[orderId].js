import { useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const ShowOrder = ({ order, currentUser }) => {
  const [msLeft, setMsLeft] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new DataTransfer(order.expiresAt) - new Date();
      setMsLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (msLeft < 0) return <div> Order Expired </div>;
  return (
    <div>
      {msLeft} seconds until order expiress
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey="pk_test_51PFd1kSCDXTabtE8EaIfZUJvUIKhVbYUAE87UHUhIHauu6Eyfjq4NsbgEirTr5xnjMGtoomiP0Idt8rtNV2gmAIx00ZheoR01p"
        amount={order.ticket.price}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

ShowOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default ShowOrder;
