import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import sampleData from "../Components/Dashborad/Sampledata";
import { updateProducts } from "../Redux/liveSlice";

export default function RealTimeProvider({ children }) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.live.products);

  useEffect(() => {
    if (!products.length) {
      dispatch(updateProducts(sampleData(30)));
    }

    const interval = setInterval(() => {
      const updated = products.map((item) => ({
        ...item,
        price: Math.floor(Math.random() * 5000) + 500,
        stock: Math.floor(Math.random() * 100),
        rating: (Math.random() * 5).toFixed(1),
      }));

      dispatch(updateProducts(updated));
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  return children;
}
