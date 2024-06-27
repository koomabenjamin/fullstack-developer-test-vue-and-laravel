<template>
  <textarea
    :placeholder="props.placeholder"
    :value="modelValue"
    :rows="props.rows"
    :required="props.required"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full border p-2 rounded text-xs"
  ></textarea>
</template>

<script setup>
const props = defineProps({
  id: [String, Number],
  name: [String, Number],
  cols: [String, Number],
  rows: [String, Number],
  modelValue: [String, Number],
  placeholder: [String, Number],
  required: {
    type: Boolean,
    default: false,
  },
});
</script>

<style></style>
