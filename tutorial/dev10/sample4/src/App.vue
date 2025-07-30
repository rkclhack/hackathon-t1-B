<script setup>
const handleClick = () => {
  alert("ボタンがクリックされました")
}
const handMouseOver = () => {
  alert("ボタンがマウスオーバーされました")
}
</script>

<template>
  <h1>Sample4</h1>
  <button @click="handleClick">click</button>
  <button @mouseover="handMouseOver">MouseOver</button>
</template>




