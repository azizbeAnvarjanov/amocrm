import ImportButton from "@/components/ImportButton";
import PipelinesAccordion from "@/components/PipelinesAccordion";
import PipelineStatusFetcher from "@/components/PipelineStatusFetcher";
import UpdateButton from "@/components/UpdateButton";
import React from "react";

const Home = () => {
  return (
    <div>
      Home
      <ImportButton />
      <p>Update Button</p>
      <UpdateButton />
      <hr />
      <PipelineStatusFetcher />
      <hr />
      <PipelinesAccordion />
    </div>
  );
};

export default Home;
