// src/components/Index/HiddenUtmFields.jsx
import React, { useEffect, useState } from "react";
import { buildFormUtm } from "../../app/utils/utm";

export default function HiddenUtmFields({ defaults = {} }) {
  const [utm, setUtm] = useState({});
  useEffect(() => {
    setUtm(buildFormUtm(defaults));
  }, [defaults]);

  return (
    <>
      <input type="hidden" name="utm_source" value={utm.utm_source || ""} />
      <input type="hidden" name="utm_medium" value={utm.utm_medium || ""} />
      <input type="hidden" name="utm_campaign" value={utm.utm_campaign || ""} />
      <input type="hidden" name="utm_term" value={utm.utm_term || ""} />
      <input type="hidden" name="utm_content" value={utm.utm_content || ""} />
      <input type="hidden" name="gclid" value={utm.gclid || ""} />
      <input type="hidden" name="fbclid" value={utm.fbclid || ""} />
    </>
  );
}
