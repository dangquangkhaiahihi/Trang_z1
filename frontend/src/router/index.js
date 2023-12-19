import { createWebHistory, createRouter } from "vue-router";
import Home from "../components/pages/Home.vue";
import About from "../components/pages/about.vue";
import Login from "../components/pages/Login.vue";
import FamilyTree from "../components/pages/FamilyTree.vue";
import NotFound from "../components/pages/NotFound.vue";
import Register from "@/components/pages/Register.vue";
import Profile from "@/components/pages/Profile.vue";
import SuchPerson from "@/components/pages/SuchPerson.vue";
import Chat from "@/components/pages/Chat.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/familytree",
    name: "FamilyTree",
    component: FamilyTree,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/profile",
    name: "/Profile",
    component: Profile,
  },
  {
    path: "/SuchPerson",
    name: "SuchPerson",
    component: SuchPerson,
  },
  {
    path: "/Chat",
    name: "Chat",
    component: Chat,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
