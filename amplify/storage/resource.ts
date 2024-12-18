import { defineStorage } from '@aws-amplify/backend';

/*
export const storage = defineStorage({
    name: 'notesStorage',
    access: (allow) => ({
      'notes/{user_id}/*': [
        // Users can only access their own notes' images
        allow.authenticated.to(['read', 'write', 'delete']),
      ]
    })
  });*/


  /*export const storage = defineStorage({
    name: 'notesStorage',
    access: (allow) => ({
      'protected/${cognito-identity.amazonaws.com:sub}/*': [
        allow.authenticated.to(['read', 'write', 'delete'])
      ]
    })
  });*/



export const storage = defineStorage({
  name: 'notesStorage',
  access: (allow) => ({
    'notes/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});