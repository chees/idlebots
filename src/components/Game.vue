<template>
  <div class="game">
    <h1>Idle Bots</h1>

    Materials: {{materials}}

    <div v-for="(bot, index) in bots" :key="bot.name">
      {{ bot.name }}
      <button>Buy 1</button>
      <button>Buy Max</button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'game',
  data () {
    return {
      materials: 10,
      bots: [
        { name: 'Nanobot' },
        { name: 'Minibot' }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.game {
  margin: 0 10px;
}

button {
  border: 1px solid green;
}
</style>
