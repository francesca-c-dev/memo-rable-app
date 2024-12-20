import { defineFunction } from "@aws-amplify/backend";
import {data} from "../../data/resource"
    
export const statisticsFunction = defineFunction({
    name: "statistics",
    entry: "./handler.ts",
 
    /*environment: {
      NOTES_TABLE_NAME: process.env.NOTES_TABLE_NAME || 'Note'
    },*/
 
   
  });
  
