import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import * as path from "path";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/note',
      name: 'note',
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
          props: { mode: 'create' },
        },
        {
          path: 'edit/:id',
          name: 'note-edit',
          component: () => import('../views/Note/NoteForm.vue'),
          props: route => ({ mode: 'edit', id: Number(route.params.id) }),
        },
      ],
    },
    {
      path: "/tag",
      name: "tag",
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
          props: { mode: 'create' },
        },
        {
          path: 'edit/:id',
          name: 'tag-edit',
          component: () => import('../views/Tag/TagForm.vue'),
          props: route => ({ mode: 'edit', id: Number(route.params.id) }),
        }
      ]
    },
    {
      path: '/optional',
      name: 'optional',
      component: () => import('../views/Optional/Index.vue'),

    }
  ],
});

export default router;
