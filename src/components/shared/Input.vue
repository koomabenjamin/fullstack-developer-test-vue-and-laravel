<template>
  <input
    :placeholder="placeholder"
    :id="props.id"
    :name="props.name"
    :type="props.type"
    :required="props.required"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full h-12 border p-2 rounded text-xs"
  />
</template>

<script setup>
const props = defineProps({
  id: [String, Number],
  name: [String, Number],
  type: [String, Number],
  modelValue: [String, Number],
  placeholder: [String, Number],
  required: {
    type: Boolean,
    default: false,
  },
});
</script>

<style></style>
