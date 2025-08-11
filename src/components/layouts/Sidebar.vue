<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';

type MenuItem = {
  id: string | number;
  label: string;
  to: string;             // path hoặc name (bạn có thể đổi theo dự án)
  icon?: string;          // class icon
  badge?: string | number;
  exact?: boolean;        // khớp chính xác path
};

type MenuGroup = {
  id: string | number;
  label: string;
  icon?: string;
  children: MenuItem[];
  initiallyOpen?: boolean;
};

const props = withDefaults(defineProps<{
  groups?: MenuGroup[];
  collapsed?: boolean;
  storageKey?: string;
}>(), {
  groups: undefined,
  collapsed: false,
  storageKey: 'app.sidebar.openGroups'
});

// Fallback menu nếu không truyền props.groups
const defaultGroups: MenuGroup[] = [
  {
    id: 'notes',
    label: 'Notes',
    icon: 'ri-sticky-note-line',
    initiallyOpen: true,
    children: [
      { id: 'note-list', label: 'Danh sách', to: '/note/list', icon: 'ri-list-check' },
      { id: 'note-create', label: 'Tạo mới', to: '/note/form', icon: 'ri-add-line' },
    ],
  },
  {
    id: 'tags',
    label: 'Tags',
    icon: 'ri-price-tag-3-line',
    children: [
      { id: 'tag-list', label: 'Quản lý thẻ', to: '/tag/list' },
      { id: 'tag-create', label: 'Tạo thẻ', to: '/tag/create' },
    ],
  },
];

const groups = computed<MenuGroup[]>(() => props.groups ?? defaultGroups);

const STORAGE_KEY = computed(() => props.storageKey);
const route = useRoute();
const router = useRouter();

const openGroups = ref<Set<MenuGroup['id']>>(new Set());

// Khôi phục trạng thái mở/đóng từ localStorage hoặc theo initiallyOpen
const restore = () => {
  const raw = localStorage.getItem(STORAGE_KEY.value);
  if (raw) {
    try {
      const arr = JSON.parse(raw) as (string | number)[];
      openGroups.value = new Set(arr);
      return;
    } catch {/* ignore */}
  }
  const defaults = groups.value.filter(g => g.initiallyOpen).map(g => g.id);
  openGroups.value = new Set(defaults);
};
restore();

// Lưu mỗi khi thay đổi
watch(
  () => Array.from(openGroups.value),
  (v) => localStorage.setItem(STORAGE_KEY.value, JSON.stringify(v)),
  { deep: true }
);

const isActive = (item: MenuItem) => {
  if (item.exact) return route.path === item.to;
  return route.path.startsWith(item.to);
};

const toggleGroup = (id: MenuGroup['id']) => {
  const next = new Set(openGroups.value);
  next.has(id) ? next.delete(id) : next.add(id);
  openGroups.value = next;
};

const navigate = (item: MenuItem) => {
  router.push(item.to);
};
</script>

<template>
  <aside class="sb" :class="{ '-collapsed': collapsed }" aria-label="Sidebar">
    <nav class="sb__nav">
      <div v-for="group in groups" :key="group.id" class="sb-group">
        <button
          class="sb-group__header"
          type="button"
          @click="toggleGroup(group.id)"
          :aria-expanded="openGroups.has(group.id)"
        >
          <span class="sb-group__icon" v-if="group.icon">
            <i :class="group.icon" aria-hidden="true"></i>
          </span>
          <span class="sb-group__label">{{ group.label }}</span>
          <span class="sb-group__caret" :class="{ open: openGroups.has(group.id) }">▾</span>
        </button>

        <transition name="sb-collapse">
          <ul
            v-show="openGroups.has(group.id)"
            class="sb-group__list"
            role="list"
          >
            <li
              v-for="item in group.children"
              :key="item.id"
              class="sb-item"
              :class="{ '-active': isActive(item) }"
            >
              <RouterLink
                class="sb-item__link"
                :to="item.to"
                @click.prevent="navigate(item)"
              >
                <span class="sb-item__icon" v-if="item.icon"><i :class="item.icon" /></span>
                <span class="sb-item__label">{{ item.label }}</span>
                <span v-if="item.badge !== undefined" class="sb-item__badge">{{ item.badge }}</span>
              </RouterLink>
            </li>
          </ul>
        </transition>
      </div>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
/* Sidebar ONE-FILE styles */
$bg: #101316;
$fg: #e6e8eb;
$muted: #cfd6dd;
$divider: rgba(255,255,255,.06);
$hover: rgba(255,255,255,.06);
$accent: #42b983;

.sb {
  width: 260px;
  background: $bg;
  color: $fg;
  border-right: 1px solid $divider;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  transition: width .2s ease;
  height: 100vh;
  &.-collapsed {
    width: 72px;

    .sb-group__label,
    .sb-item__label,
    .sb-item__badge,
    .sb-group__caret {
      display: none;
    }

    .sb-group__icon, .sb-item__icon { margin-right: 0; }
  }
}

.sb__nav {
  padding: 8px;
}

.sb-group {
  &__header {
    width: 100%;
    padding: 10px 12px;
    margin: 4px 0;
    border: 0;
    background: transparent;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    border-radius: 8px;

    &:hover { background: $hover; }
  }

  &__icon {
    width: 20px;
    display: inline-flex;
    justify-content: center;
    opacity: .9;
  }

  &__label {
    flex: 1;
    text-align: left;
    font-weight: 600;
    letter-spacing: .2px;
  }

  &__caret {
    transition: transform .2s ease;
    &.open { transform: rotate(180deg); }
  }

  &__list {
    list-style: none;
    padding: 4px 0 6px;
    margin: 0 0 6px 0;
  }
}

.sb-item {
  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px 8px 36px;
    color: $muted;
    text-decoration: none;
    border-radius: 8px;
    &:hover { background: $hover; color: #fff; }
  }

  &__icon {
    width: 18px;
    text-align: center;
    opacity: .9;
  }

  &__label { flex: 1; }

  &__badge {
    background: #2a3138;
    color: #b6c2cf;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 999px;
  }

  &.-active .sb-item__link {
    background: rgba(66,185,131,0.18);
    color: #eafff5;
  }
}

/* collapse transition */
.sb-collapse-enter-from,
.sb-collapse-leave-to { max-height: 0; opacity: 0; }
.sb-collapse-enter-to,
.sb-collapse-leave-from { max-height: 600px; opacity: 1; }
.sb-collapse-enter-active,
.sb-collapse-leave-active { transition: all .18s ease; }
</style>
