import { defineStore } from "pinia";
// import axios from 'axios'
// import api from "../api";


export const useCartStore = defineStore('cart', {
    state:()=>({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        cartItems: localStorage.getItem('cartItems') || null

    }),
    getters:{
        isAuthenticated: (state)=>!!state.token,
        getUser: (state) => state.user,
        getCart: (state)=>state.cartItems
    },
    actions: {
        setCartItems(cartItems, token) {
          this.cartItems = cartItems;
          this.token = token;
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          localStorage.setItem('token', token);
        },
        clearCartItems() {
            this.cartItems = null;
            this.token = null;
            localStorage.removeItem('cartItems');
            localStorage.removeItem('token');
          },
    }

})