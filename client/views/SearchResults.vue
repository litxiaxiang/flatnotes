<template>
  <div class="flex h-full max-w-[700px] flex-col">
    <ConfirmModal
      v-model="isBulkDeleteModalVisible"
      :message="`确定要删除已选择的 ${selectedCount} 条笔记吗？`"
      confirmButtonText="批量删除"
      confirmButtonStyle="danger"
      @confirm="bulkDeleteConfirmedHandler"
    />

    <!-- Search Input -->
    <SearchInput :initialSearchTerm="props.searchTerm" class="mb-2" />

    <LoadingIndicator ref="loadingIndicator" class="flex-1">
      <div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div
          v-if="isAllNotesView && results.length > 0"
          class="flex flex-wrap items-center gap-2"
        >
          <label class="flex cursor-pointer items-center gap-2 text-sm text-theme-text-muted">
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-theme-border text-theme-brand focus:ring-theme-brand"
              :checked="allVisibleSelected"
              @change="toggleAllSelections"
            />
            <span>{{ allVisibleSelected ? "取消全选" : "全选" }}</span>
          </label>
          <span class="text-sm text-theme-text-muted">
            已选择 {{ selectedCount }} 条
          </span>
          <CustomButton
            label="下载选中"
            :iconPath="mdiDownloadOutline"
            :disabled="!hasSelection || actionInProgress"
            @click="bulkDownloadHandler"
          />
          <CustomButton
            v-if="canDeleteNotes"
            label="删除选中"
            :iconPath="mdilDelete"
            style="danger"
            :disabled="!hasSelection || actionInProgress"
            @click="bulkDeleteHandler"
          />
        </div>

        <!-- Sort By -->
        <div class="flex justify-end">
          <CustomButton
            :label="`排序方式: ${sortByName}`"
            :iconPath="mdiSort"
            class="mb-1"
            @click="toggleSortMenu"
          />
          <PrimeMenu ref="sortMenu" :model="menuItems" :popup="true" />
        </div>
      </div>

      <!-- Search Results -->
      <div
        v-for="result in results"
        :key="result.title"
        class="mb-4 cursor-pointer rounded px-2 py-1 hover:bg-theme-background-elevated"
      >
        <div class="flex items-start gap-3">
          <label
            v-if="isAllNotesView"
            class="mt-1 flex cursor-pointer items-center"
            @click.stop
          >
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-theme-border text-theme-brand focus:ring-theme-brand"
              :checked="isSelected(result.title)"
              @change="toggleSelection(result.title)"
            />
          </label>
          <RouterLink
            :to="{ name: 'note', params: { title: result.title } }"
            class="min-w-0 flex-1"
          >
            <!-- Title and Tags -->
            <div>
              <span v-html="result.titleHighlightsOrTitle" class="mr-2"></span>
              <Tag v-for="tag in result.tagMatches" :key="tag" :tag="tag" class="mr-1" />
            </div>
            <!-- Last Modified and Content Highlights -->
            <div>
              <span class="text-theme-text-muted">{{
                result.lastModifiedAsString
              }}</span>
              <span v-if="result.contentHighlights"> - </span>
              <span
                v-html="result.contentHighlights"
                class="text-theme-text-muted"
              ></span>
            </div>
          </RouterLink>
        </div>
      </div>
    </LoadingIndicator>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { mdiDownloadOutline, mdiMagnify, mdiSort } from "@mdi/js";
import { mdilDelete } from "@mdi/light-js";
import {
  apiErrorHandler,
  bulkDeleteNotes,
  downloadNotesArchive,
  getNotes,
} from "../api.js";
import ConfirmModal from "../components/ConfirmModal.vue";
import CustomButton from "../components/CustomButton.vue";
import LoadingIndicator from "../components/LoadingIndicator.vue";
import PrimeMenu from "../components/PrimeMenu.vue";
import Tag from "../components/Tag.vue";
import { authTypes, params, searchSortOptions } from "../constants.js";
import { useGlobalStore } from "../globalStore.js";
import { getToastOptions } from "../helpers.js";
import SearchInput from "../partials/SearchInput.vue";

const props = defineProps({
  searchTerm: String,
  sortBy: {
    type: Number,
    default: searchSortOptions.score,
  },
});

const loadingIndicator = ref();
const results = ref([]);
const router = useRouter();
const sortMenu = ref();
const toast = useToast();
const globalStore = useGlobalStore();
const selectedTitles = ref([]);
const isBulkDeleteModalVisible = ref(false);
const actionInProgress = ref(false);

const isAllNotesView = computed(() => props.searchTerm === "*");
const canDeleteNotes = computed(
  () => globalStore.config.authType !== authTypes.readOnly,
);
const selectedCount = computed(() => selectedTitles.value.length);
const hasSelection = computed(() => selectedCount.value > 0);
const allVisibleSelected = computed(() => {
  return (
    results.value.length > 0 &&
    results.value.every((result) => selectedTitles.value.includes(result.title))
  );
});

const sortByName = computed(() => {
  const sortOptionNames = {
    [searchSortOptions.title]: "标题",
    [searchSortOptions.lastModified]: "最后修改",
    [searchSortOptions.score]: "匹配度",
  };
  return sortOptionNames[props.sortBy];
});

function init() {
  loadingIndicator.value.setLoading();
  getNotes(props.searchTerm)
    .then((data) => {
      results.value = sortResults(data);
      clearSelection();
      if (results.value.length > 0) {
        loadingIndicator.value.setLoaded();
      } else {
        loadingIndicator.value.setFailed("No Results", mdiMagnify);
      }
    })
    .catch((error) => {
      loadingIndicator.value.setFailed();
      apiErrorHandler(error, toast);
    });
}

function sortResults(results) {
  if (props.sortBy === searchSortOptions.title) {
    return results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (props.sortBy === searchSortOptions.lastModified) {
    return results.sort((a, b) => b.lastModified - a.lastModified);
  } else {
    return results.sort((a, b) => b.score - a.score);
  }
}

function reSortResults() {
  results.value = sortResults(results.value);
}

function updateSortByParam(sortBy) {
  router.push({
    name: "search",
    query: {
      [params.searchTerm]: props.searchTerm,
      [params.sortBy]: sortBy,
    },
  });
}

const menuItems = [
  {
    label: "排序方式: 匹配度",
    command: () => {
      updateSortByParam(searchSortOptions.score);
    },
  },

  {
    label: "排序方式: 标题",
    command: () => {
      updateSortByParam(searchSortOptions.title);
    },
  },
  {
    label: "排序方式: 最后修改",
    command: () => {
      updateSortByParam(searchSortOptions.lastModified);
    },
  },
];

function toggleSortMenu(event) {
  sortMenu.value.toggle(event);
}

function clearSelection() {
  selectedTitles.value = [];
}

function isSelected(title) {
  return selectedTitles.value.includes(title);
}

function toggleSelection(title) {
  if (isSelected(title)) {
    selectedTitles.value = selectedTitles.value.filter(
      (selectedTitle) => selectedTitle !== title,
    );
  } else {
    selectedTitles.value = [...selectedTitles.value, title];
  }
}

function toggleAllSelections() {
  if (allVisibleSelected.value) {
    clearSelection();
    return;
  }
  selectedTitles.value = results.value.map((result) => result.title);
}

function bulkDeleteHandler() {
  if (!hasSelection.value || actionInProgress.value) {
    return;
  }
  isBulkDeleteModalVisible.value = true;
}

function bulkDeleteConfirmedHandler() {
  if (!hasSelection.value) {
    return;
  }
  const titlesToDelete = [...selectedTitles.value];
  actionInProgress.value = true;
  bulkDeleteNotes(titlesToDelete)
    .then(() => {
      results.value = results.value.filter(
        (result) => !titlesToDelete.includes(result.title),
      );
      clearSelection();
      if (results.value.length > 0) {
        loadingIndicator.value.setLoaded();
      } else {
        loadingIndicator.value.setFailed("No Results", mdiMagnify);
      }
      toast.add(
        getToastOptions(
          `Deleted ${titlesToDelete.length} notes.`,
          "Success",
          "success",
        ),
      );
    })
    .catch((error) => {
      apiErrorHandler(error, toast);
    })
    .finally(() => {
      actionInProgress.value = false;
    });
}

function bulkDownloadHandler() {
  if (!hasSelection.value || actionInProgress.value) {
    return;
  }
  actionInProgress.value = true;
  downloadNotesArchive(selectedTitles.value)
    .then(({ blob, filename }) => {
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");

      downloadLink.href = downloadUrl;
      downloadLink.download = filename;
      downloadLink.click();

      URL.revokeObjectURL(downloadUrl);
    })
    .catch((error) => {
      apiErrorHandler(error, toast);
    })
    .finally(() => {
      actionInProgress.value = false;
    });
}

watch(() => props.searchTerm, init);
watch(() => props.sortBy, reSortResults);
onMounted(init);
</script>

<style>
.match {
  @apply text-theme-brand;
}
</style>
