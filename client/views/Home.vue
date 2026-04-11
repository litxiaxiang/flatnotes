<template>
  <div class="flex h-full justify-center px-4">
    <div class="flex w-full max-w-[560px] flex-1 flex-col items-center pt-[15vh] sm:pt-[20vh]">
      <Logo class="mb-5" />
      
      <SearchInput class="mb-5 shadow-[0_0_20px] shadow-theme-shadow" />
      
      <LoadingIndicator
        ref="loadingIndicator"
        class="flex w-full min-h-56 flex-col items-center"
        hideLoader
      >
        <div 
          v-if="notes.length > 0" 
          class="w-full rounded-3xl bg-white/40 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur-2xl dark:bg-gray-900/40 dark:ring-white/10 transition-all duration-500"
        >
          <p class="mb-4 pl-2 text-xs font-semibold tracking-widest uppercase text-theme-text-very-muted opacity-80">
            {{ globalStore.config.quickAccessTitle }}
          </p>
          
          <div class="flex flex-col gap-2">
            <RouterLink
              v-for="note in notes.slice(0, globalStore.config.quickAccessLimit)"
              :key="note.title"
              :to="{ name: 'note', params: { title: note.title } }"
              class="group block w-full"
            >
              <CustomButton 
                :label="note.title" 
                allowWrap
                class="w-full justify-start rounded-xl border-transparent bg-white/60 px-4 py-3 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:bg-white hover:shadow-md dark:bg-black/40 dark:ring-white/10 dark:hover:bg-black/60"
              />
            </RouterLink>
            
            <RouterLink
              v-if="notes.length > globalStore.config.quickAccessLimit"
              :to="{
                name: 'search',
                query: {
                  term: globalStore.config.quickAccessTerm,
                  sortBy: searchSortOptions[globalStore.config.quickAccessSort],
                },
              }"
              title="Show more"
              class="group mt-2 block w-full"
            >
              <CustomButton 
                :iconPath="mdiDotsHorizontal" 
                class="w-full justify-center rounded-xl border-transparent bg-transparent py-2 shadow-none transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10"
              />
            </RouterLink>
          </div>
        </div>
      </LoadingIndicator>
    </div>
  </div>
</template>

<script setup>
import { mdiDotsHorizontal } from "@mdi/js";
import { useToast } from "primevue/usetoast";
import { onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";

import { apiErrorHandler, getNotes } from "../api.js";
import CustomButton from "../components/CustomButton.vue";
import LoadingIndicator from "../components/LoadingIndicator.vue";
import Logo from "../components/Logo.vue";
import { searchSortOptions } from "../constants.js";
import { useGlobalStore } from "../globalStore.js";
import SearchInput from "../partials/SearchInput.vue";

const globalStore = useGlobalStore();
const loadingIndicator = ref();
const notes = ref([]);
const toast = useToast();

function init() {
  if (globalStore.config.quickAccessHide) {
    return;
  }
  getNotes(
    globalStore.config.quickAccessTerm,
    globalStore.config.quickAccessSort,
    // Order by ascending if sorting by title, descending otherwise.
    globalStore.config.quickAccessSort === "title"
      ? "asc"
      : "desc",
    // Limit is increased by 1 to check if there are more notes than the limit.
    globalStore.config.quickAccessLimit + 1,
  )
    .then((data) => {
      notes.value = data;
      loadingIndicator.value.setLoaded();
    })
    .catch((error) => {
      loadingIndicator.value.setFailed();
      apiErrorHandler(error, toast);
    });
}

// Watch to allow for delayed config load.
watch(() => globalStore.config.hideRecentlyModified, init);
onMounted(init);
</script>