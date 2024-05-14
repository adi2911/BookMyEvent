import { useEffect } from "react";

const ShowOrder = ({ order }) => {
  const [msLeft, setMsLeft] = useState("");

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
  return <div>{msLeft} seconds until order expiress</div>;
};

ShowOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default ShowOrder;
