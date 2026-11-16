
import { useEffect } from "react";

const ZohoSalesIQ = () => {
  useEffect(() => {
    window.$zoho = window.$zoho || {};

    window.$zoho.salesiq =
      window.$zoho.salesiq || {
        ready: function () {},
      };

    // Prevent duplicate script
    if (document.getElementById("zsiqscript")) return;

    const script = document.createElement("script");

    script.id = "zsiqscript";
    script.src =
      "https://salesiq.zohopublic.com/widget?wc=siqa25cca9250599e36d30a02f38ddd4c73";

    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return null;
};

export default ZohoSalesIQ;
