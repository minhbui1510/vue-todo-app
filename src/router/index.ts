import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import * as path from "path";
import {authGuard} from "@/router/guards/authGuard.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {requiresAuth: true}
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login/Login.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/note',
      name: 'note',
      meta: {requiresAuth: true},
      children: [
        {
          path: 'list',
          name: 'note-list',
          component: () => import('../views/Note/NoteList.vue'),
        },
        {
          path: 'form',
          name: 'note-create',
          component: () => import('../views/Note/NoteForm.vue'),
          props: {mode: 'create'},
        },
        {
          path: 'edit/:id',
          name: 'note-edit',
          component: () => import('../views/Note/NoteForm.vue'),
          props: route => ({mode: 'edit', id: Number(route.params.id)}),
        },
      ],
    },
    {
      path: "/tag",
      name: "tag",
      meta: {requiresAuth: true},
      children: [
        {
          path: 'list',
          name: 'tag-list',
          component: () => import('../views/Tag/TagList.vue'),
        },
        {
          path: 'create',
          name: 'tag-create',
          component: () => import('../views/Tag/TagForm.vue'),
          props: {mode: 'create'},
        },
        {
          path: 'edit/:id',
          name: 'tag-edit',
          component: () => import('../views/Tag/TagForm.vue'),
          props: route => ({mode: 'edit', id: Number(route.params.id)}),
        }
      ]
    },
    {
      path: '/optional',
      name: 'optional',
      component: () => import('../views/Optional/Index.vue'),

    },
    {
      path: '/ui-document',
      name: 'ui-document',
      meta: {requiresAuth: true},
      component: () => import('../views/DocumentUI/index.vue'),
      children: [
        {
          path: '/input',
          name: 'input',
          component: () => import('../views/DocumentUI/InputDocument.vue')
        }
      ]
    }
  ],
});
router.beforeEach(authGuard)
export default router;
