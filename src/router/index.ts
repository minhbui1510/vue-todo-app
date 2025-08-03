import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

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
  ],
});

export default router;
