import { reactive } from 'vue'

export const authenStore = reactive({
    loggedIn: false,
    user: null,
    setIsLoggedIn(val) {
        this.loggedIn = val;
    },
    setUser(val) {
        this.user = val
    }
})