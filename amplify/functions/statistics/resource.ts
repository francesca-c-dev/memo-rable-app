import { defineFunction } from "@aws-amplify/backend";
    
export const statisticsFunction = defineFunction({
    name: "statistics",
    entry: "./handler.ts",
  
  });