<template>
  <div class="flex min-w-0" :class="{ 'items-center': !allowWrap, 'items-start': allowWrap }">
    <SvgIcon
      v-if="iconPath"
      type="mdi"
      :path="iconPath"
      :size="iconSize"
      :class="{ 'mr-1': label }"
    ></SvgIcon>
    <span
      v-if="label"
      class="min-w-0"
      :class="{ 'break-words whitespace-normal text-left': allowWrap }"
    >{{ label }}</span>
  </div>
</template>

<script setup>
import SvgIcon from "@jamescoyle/vue-icon";

defineProps({
  iconPath: String,
  iconSize: {
    type: String,
    default: "1.25em",
  },
  label: String,
  allowWrap: Boolean,
});
</script>
