import { defineStorage } from '@aws-amplify/backend';



export const storage = defineStorage({
  name: 'notesStorage',
  access: (allow) => ({
    'notes/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});