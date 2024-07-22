import React, { useEffect, useRef, useState } from "react";
import { LookerEmbedSDK } from "@looker/embed-sdk";

const LookerEmbed = () => {
  const embedContainer = useRef(null);
  const [dashboard, setDashboard] = useState(null);
  const [startDate, setStartDate] = useState("2021-01-01");
  const [endDate, setEndDate] = useState("2021-01-02");

  useEffect(() => {
    if (embedContainer.current) {
        embedContainer.current.innerHTML = '';
    }
    LookerEmbedSDK.init("https://servinformacion.cloud.looker.com");

    LookerEmbedSDK.createDashboardWithId("19")
      .appendTo(embedContainer.current)
      .on("dashboard:loaded", (event) => {
        console.log("Dashboard has loaded");
      })
      .on("dashboard:run:start", () => {
        console.log("Dashboard run started");
      })
      .on("dashboard:run:complete", () => {
        console.log("Dashboard run completed");
      })
      // .withClassName("looker-embed")
      // .withNext()
      // .withFilters({"Reported Date Date": "2021/01/01 to 2022/01/02"})
      .build()
      .connect()
      .then((dashboard) => {
        console.log(dashboard);
        setDashboard(dashboard);
      })
      .catch((error) => {
        console.error("Connection error", error);
      });
  }, []);

  const updateDashboard = () => {
    if (dashboard) {
      const filters = {
        "Reported Date Date": `${startDate} to ${endDate}`,
      };
      dashboard.updateFilters(filters);
      dashboard.run();
    }
  };

  return (
    <div className="looker-embed">
      <div className="filter-container">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={updateDashboard}>Update Dashboard</button>
      </div>
      <div className="embed-container" ref={embedContainer}></div>
    </div>
  );
};

export default LookerEmbed;
