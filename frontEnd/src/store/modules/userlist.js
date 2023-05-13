import Vue from 'vue'
import { UserList } from '@/api/login'

const userlist = {
    state: {
      UserList:[]
    },
  
    mutations: {
      USERLIST(state,UserList){
        state.UserList = UserList;
      }
    },
  
    actions: {
      
  
    },
  }
  
  export default userlist