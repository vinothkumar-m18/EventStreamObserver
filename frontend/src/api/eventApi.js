import axios from 'axios';
import api from '../services/api.js';
export const fetchEvents = async ()=>{
    try{
        const res = await api.get('/events');
        console.log('fetched events inside fetchEvents method : ', res.data.events);
        return res.data.events;
    }catch(error){
        console.log('error fetching events inside fetchevents: ', error);
    }
};
