<template>
  <nav class="mb-2 flex justify-between align-top md:mb-12">
    <RouterLink :to="{ name: 'home' }" v-if="!hideLogo">
      <Logo responsive></Logo>
    </RouterLink>
    <div class="flex grow items-start justify-end">
      <!-- New Note -->
      <RouterLink v-if="showNewButton" :to="{ name: 'new' }">
        <CustomButton :iconPath="mdilPlusCircle" label="新建笔记" />
      </RouterLink>
      <!-- Menu -->
      <CustomButton
        class="ml-1"
        :iconPath="mdilMenu"
        label="菜单"
        @click="toggleMenu"
      />
      <PrimeMenu ref="menu" :model="menuItems" :popup="true" />
    </div>
  </nav>
</template>

<script setup>
import {
  mdilLogout,
  mdilMagnify,
  mdilMenu,
  mdilMonitor,
  mdilNoteMultiple,
  mdilPlusCircle,
} from "@mdi/light-js";
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import CustomButton from "../components/CustomButton.vue";
import Logo from "../components/Logo.vue";
import PrimeMenu from "../components/PrimeMenu.vue";
import { authTypes, params, searchSortOptions } from "../constants.js";
import { useGlobalStore } from "../globalStore.js";
import { getThemeMode, setThemeMode, themeModes } from "../helpers.js";
import { clearStoredToken } from "../tokenStorage.js";

const globalStore = useGlobalStore();
const menu = ref();
const router = useRouter();
const themeMode = ref(getThemeMode());

defineProps({
  hideLogo: Boolean,
});

const emit = defineEmits(["toggleSearchModal"]);

const menuItems = computed(() => [
  {
    label: "搜索",
    icon: mdilMagnify,
    command: () => emit("toggleSearchModal"),
    keyboardShortcut: "/",
  },
  {
    label: "所有笔记",
    icon: mdilNoteMultiple,
    command: () =>
      router.push({
        name: "search",
        query: {
          [params.searchTerm]: "*",
          [params.sortBy]: searchSortOptions.title,
        },
      }),
  },
  {
    separator: true,
  },
  {
    label: "跟随系统",
    icon: mdilMonitor,
    command: () => updateThemeMode(themeModes.system),
    keyboardShortcut: getThemeMarker(themeModes.system),
  },
  {
    label: "浅色",
    command: () => updateThemeMode(themeModes.light),
    keyboardShortcut: getThemeMarker(themeModes.light),
  },
  {
    label: "深色",
    command: () => updateThemeMode(themeModes.dark),
    keyboardShortcut: getThemeMarker(themeModes.dark),
  },
  {
    separator: true,
    visible: showLogOutButton,
  },
  {
    label: "退出登录",
    icon: mdilLogout,
    command: logOut,
    visible: showLogOutButton,
  },
]);

const showNewButton = computed(() => {
  return globalStore.config.authType !== authTypes.readOnly;
});

function logOut() {
  clearStoredToken();
  localStorage.clear();
  router.push({ name: "login" });
}

function getThemeMarker(mode) {
  return themeMode.value === mode ? "当前" : undefined;
}

function updateThemeMode(mode) {
  setThemeMode(mode);
  themeMode.value = mode;
}

function toggleMenu(event) {
  menu.value.toggle(event);
}

function showLogOutButton() {
  return ![authTypes.none, authTypes.readOnly].includes(globalStore.config.authType);
}
</script>
