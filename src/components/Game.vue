<template>
  <div class="game">
    <h1>Idle Bots</h1>

    Materials: {{ materials.toString() }}
    ({{ rate.toString() }}/s)

    <div v-for="bot in bots" :key="bot.name" class="bot">
      {{ bot.owned.toString() }} {{ bot.name }}
      <div>
        <button @click="buy(bot)" :disabled="materials.lt(bot.cost)">Buy 1 ({{ bot.cost }})</button>
        <button @click="buy(bot)" :disabled="materials.lt(bot.cost)">Buy Max</button>
      </div>
    </div>

  </div>
</template>

<script>
import Big from 'big.js'

export default {
  name: 'game',
  data () {
    return {
      materials: new Big(100),
      rate: new Big(0),
      bots: [
        { name: 'Nanobots', owned: new Big(0), cost: 100, generates: 1 },
        { name: 'Minibots', owned: new Big(0), cost: 1000, generates: 10 }
      ]
    }
  },
  methods: {
    tick: function () {
      const sleep = 100
      const before = this.materials
      for (const bot of this.bots) {
        this.materials = this.materials.plus(bot.owned.times(bot.generates))
      }
      this.rate = this.materials.minus(before).times(1000 / sleep)
      setTimeout(this.tick, sleep)
    },
    buy: function (b) {
      this.materials = this.materials.minus(b.cost)
      b.owned = b.owned.plus(1)
    }
  },
  created: function () {
    this.tick()
  }
}
</script>

<style scoped>
.game {
  margin: 0 10px;
}

.bot {
  display: flex;
  justify-content: space-between;
}

button {
  border: 1px solid green;
}
</style>
