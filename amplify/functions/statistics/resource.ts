import { defineFunction } from "@aws-amplify/backend";
    
export const statisticsFunction = defineFunction({
    name: "statistics",
    entry: "./handler.ts",
 
    environment: {
      NOTES_TABLE_NAME: process.env.NOTES_TABLE_NAME || ''
    },
   
  });
  
